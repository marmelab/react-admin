import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { DataProvider, useDataProvider, useListContext } from 'react-admin';

import { Deal } from '../types';
import { DealColumn } from './DealColumn';
import { DealsByStage, getDealsByStage, stages } from './stages';

export const DealListContent = () => {
    const { data: unorderedDeals, isLoading, refetch } = useListContext<Deal>();
    const dataProvider = useDataProvider();

    const [dealsByStage, setDealsByStage] = useState<DealsByStage>(
        getDealsByStage([])
    );

    useEffect(() => {
        if (unorderedDeals) {
            const newDealsByStage = getDealsByStage(unorderedDeals);
            if (!isEqual(newDealsByStage, dealsByStage)) {
                setDealsByStage(newDealsByStage);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unorderedDeals]);

    if (isLoading) return null;

    const onDragEnd: OnDragEndResponder = result => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;
        const sourceDeal = dealsByStage[sourceStage][source.index]!;
        const destinationDeal = dealsByStage[destinationStage][
            destination.index
        ] ?? {
            stage: destinationStage,
            index: undefined, // undefined if dropped after the last item
        };

        // compute local state change synchronously
        setDealsByStage(
            updateDealStageLocal(
                sourceDeal,
                { stage: sourceStage, index: source.index },
                { stage: destinationStage, index: destination.index },
                dealsByStage
            )
        );

        // persist the changes
        updateDealStage(sourceDeal, destinationDeal, dataProvider).then(() => {
            refetch();
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box display="flex">
                {stages.map(stage => (
                    <DealColumn
                        stage={stage}
                        deals={dealsByStage[stage]}
                        key={stage}
                    />
                ))}
            </Box>
        </DragDropContext>
    );
};

const updateDealStageLocal = (
    sourceDeal: Deal,
    source: { stage: string; index: number },
    destination: {
        stage: string;
        index?: number; // undefined if dropped after the last item
    },
    dealsByStage: DealsByStage
) => {
    if (source.stage === destination.stage) {
        // moving deal inside the same column
        const column = dealsByStage[source.stage];
        column.splice(source.index, 1);
        column.splice(destination.index ?? column.length + 1, 0, sourceDeal);
        return {
            ...dealsByStage,
            [destination.stage]: column,
        };
    } else {
        // moving deal across columns
        const sourceColumn = dealsByStage[source.stage];
        const destinationColumn = dealsByStage[destination.stage];
        sourceColumn.splice(source.index, 1);
        destinationColumn.splice(
            destination.index ?? destinationColumn.length + 1,
            0,
            sourceDeal
        );
        return {
            ...dealsByStage,
            [source.stage]: sourceColumn,
            [destination.stage]: destinationColumn,
        };
    }
};

const updateDealStage = async (
    source: Deal,
    destination: {
        stage: string;
        index?: number; // undefined if dropped after the last item
    },
    dataProvider: DataProvider
) => {
    if (source.stage === destination.stage) {
        // moving deal inside the same column
        // Fetch all the deals in this stage (because the list may be filtered, but we need to update even non-filtered deals)
        const { data: columnDeals } = await dataProvider.getList('deals', {
            sort: { field: 'index', order: 'ASC' },
            pagination: { page: 1, perPage: 100 },
            filter: { stage: source.stage },
        });
        const destinationIndex = destination.index ?? columnDeals.length + 1;

        if (source.index > destinationIndex) {
            // deal moved up, eg
            // dest   src
            //  <------
            // [4, 7, 23, 5]
            await Promise.all([
                // for all deals between destinationIndex and source.index, increase the index
                ...columnDeals
                    .filter(
                        deal =>
                            deal.index >= destinationIndex &&
                            deal.index < source.index
                    )
                    .map(deal =>
                        dataProvider.update('deals', {
                            id: deal.id,
                            data: { index: deal.index + 1 },
                            previousData: deal,
                        })
                    ),
                // for the deal that was moved, update its index
                dataProvider.update('deals', {
                    id: source.id,
                    data: { index: destinationIndex },
                    previousData: source,
                }),
            ]);
        } else {
            // deal moved down, e.g
            // src   dest
            //  ------>
            // [4, 7, 23, 5]
            await Promise.all([
                // for all deals between source.index and destinationIndex, decrease the index
                ...columnDeals
                    .filter(
                        deal =>
                            deal.index <= destinationIndex &&
                            deal.index > source.index
                    )
                    .map(deal =>
                        dataProvider.update('deals', {
                            id: deal.id,
                            data: { index: deal.index - 1 },
                            previousData: deal,
                        })
                    ),
                // for the deal that was moved, update its index
                dataProvider.update('deals', {
                    id: source.id,
                    data: { index: destinationIndex },
                    previousData: source,
                }),
            ]);
        }
    } else {
        // moving deal across columns
        // Fetch all the deals in both stages (because the list may be filtered, but we need to update even non-filtered deals)
        const [
            { data: sourceDeals },
            { data: destinationDeals },
        ] = await Promise.all([
            dataProvider.getList('deals', {
                sort: { field: 'index', order: 'ASC' },
                pagination: { page: 1, perPage: 100 },
                filter: { stage: source.stage },
            }),
            dataProvider.getList('deals', {
                sort: { field: 'index', order: 'ASC' },
                pagination: { page: 1, perPage: 100 },
                filter: { stage: destination.stage },
            }),
        ]);
        const destinationIndex =
            destination.index ?? destinationDeals.length + 1;

        await Promise.all([
            // decrease index on the deals after the source index in the source columns
            ...sourceDeals
                .filter(deal => deal.index > source.index)
                .map(deal =>
                    dataProvider.update('deals', {
                        id: deal.id,
                        data: { index: deal.index - 1 },
                        previousData: deal,
                    })
                ),
            // increase index on the deals after the destination index in the destination columns
            ...destinationDeals
                .filter(deal => deal.index >= destinationIndex)
                .map(deal =>
                    dataProvider.update('deals', {
                        id: deal.id,
                        data: { index: deal.index + 1 },
                        previousData: deal,
                    })
                ),
            // change the dragged deal to take the destination index and column
            dataProvider.update('deals', {
                id: source.id,
                data: {
                    index: destinationIndex,
                    stage: destination.stage,
                },
                previousData: source,
            }),
        ]);
    }
};
