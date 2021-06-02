import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
    useMutation,
    Identifier,
    useListContext,
    RecordMap,
    DataProviderContext,
} from 'react-admin';
import { Box } from '@material-ui/core';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';
import isEqual from 'lodash/isEqual';

import { DealColumn } from './DealColumn';
import { stages } from './stages';
import { Deal } from '../types';

interface DealsByColumn {
    [stage: string]: Identifier[];
}

const initialDeals: DealsByColumn = stages.reduce(
    (obj, stage) => ({ ...obj, [stage]: [] }),
    {}
);

const getDealsByColumn = (
    ids: Identifier[],
    data: RecordMap<Deal>
): DealsByColumn => {
    // group deals by column
    const columns = ids.reduce(
        (acc, id) => {
            acc[data[id].stage].push(id);
            return acc;
        },
        stages.reduce((obj, stage) => ({ ...obj, [stage]: [] }), {} as any)
    );
    // order each column by index
    stages.forEach(stage => {
        columns[stage] = columns[stage].sort(
            (a: Identifier, b: Identifier) => data[a].index - data[b].index
        );
    });
    return columns;
};

export const DealListContent = () => {
    const {
        data,
        ids,
        loaded,
        page,
        perPage,
        currentSort,
        filterValues,
    } = useListContext<Deal>();

    const [deals, setDeals] = useState<DealsByColumn>(
        loaded ? getDealsByColumn(ids, data) : initialDeals
    );
    // we use the raw dataProvider to avoid too many updates to the Redux store after updates (which would create jank)
    const dataProvider = useContext(DataProviderContext);

    // FIXME: use refetch when available
    const [refresh] = useMutation({
        resource: 'deals',
        type: 'getList',
        payload: {
            pagination: { page, perPage },
            sort: currentSort,
            filter: filterValues,
        },
    });

    // update deals by columns when the dataProvider response updates
    useEffect(() => {
        if (!loaded) return;
        const newDeals = getDealsByColumn(ids, data);
        if (isEqual(deals, newDeals)) {
            return;
        }
        setDeals(newDeals);
    }, [data, ids, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!loaded) return null;

    const onDragEnd: OnDragEndResponder = async result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            // moving deal inside the same column

            const column = Array.from(deals[source.droppableId]); // [4, 7, 23, 5] array of ids
            const sourceDeal = data[column[source.index]];
            const destinationDeal = data[column[destination.index]];

            // update local state
            // remove source deal from column
            column.splice(source.index, 1);
            // readd source deal at destination
            column.splice(destination.index, 0, Number(draggableId));
            setDeals({
                ...deals,
                [source.droppableId]: column,
            });

            // update backend
            // Fetch all the deals in this stage (because the list may be filtered, but we need to update even non-filtered deals)
            const { data: columnDeals } = await dataProvider.getList('deals', {
                sort: { field: 'index', order: 'ASC' },
                pagination: { page: 1, perPage: 100 },
                filter: { stage: source.droppableId },
            });

            if (source.index > destination.index) {
                // deal moved up, eg
                // dest   src
                //  <------
                // [4, 7, 23, 5]

                await Promise.all([
                    // for all deals between destination.index and source.index, increase the index
                    ...columnDeals
                        .filter(
                            deal =>
                                deal.index >= destinationDeal.index &&
                                deal.index < sourceDeal.index
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
                        id: sourceDeal.id,
                        data: { index: destinationDeal.index },
                        previousData: sourceDeal,
                    }),
                ]);

                refresh();
            } else {
                // deal moved down, e.g
                // src   dest
                //  ------>
                // [4, 7, 23, 5]

                await Promise.all([
                    // for all deals between source.index and destination.index, decrease the index
                    ...columnDeals
                        .filter(
                            deal =>
                                deal.index <= destinationDeal.index &&
                                deal.index > sourceDeal.index
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
                        id: sourceDeal.id,
                        data: { index: destinationDeal.index },
                        previousData: sourceDeal,
                    }),
                ]);

                refresh();
            }
        } else {
            // moving deal across columns

            const sourceColumn = Array.from(deals[source.droppableId]); // [4, 7, 23, 5] array of ids
            const destinationColumn = Array.from(
                deals[destination.droppableId]
            ); // [4, 7, 23, 5] arrays of ids
            const sourceDeal = data[sourceColumn[source.index]];
            const destinationDeal = data[destinationColumn[destination.index]]; // may be undefined if dropping at the end of a column

            // update local state
            sourceColumn.splice(source.index, 1);
            destinationColumn.splice(destination.index, 0, draggableId);
            setDeals({
                ...deals,
                [source.droppableId]: sourceColumn,
                [destination.droppableId]: destinationColumn,
            });

            // update backend
            // Fetch all the deals in both stages (because the list may be filtered, but we need to update even non-filtered deals)
            const [
                { data: sourceDeals },
                { data: destinationDeals },
            ] = await Promise.all([
                dataProvider.getList('deals', {
                    sort: { field: 'index', order: 'ASC' },
                    pagination: { page: 1, perPage: 100 },
                    filter: { stage: source.droppableId },
                }),
                dataProvider.getList('deals', {
                    sort: { field: 'index', order: 'ASC' },
                    pagination: { page: 1, perPage: 100 },
                    filter: { stage: destination.droppableId },
                }),
            ]);

            await Promise.all([
                // decrease index on the deals after the source index in the source columns
                ...sourceDeals
                    .filter(deal => deal.index > sourceDeal.index)
                    .map(deal =>
                        dataProvider.update('deals', {
                            id: deal.id,
                            data: { index: deal.index - 1 },
                            previousData: deal,
                        })
                    ),
                // increase index on the deals after the destination index in the destination columns
                ...destinationDeals
                    .filter(deal =>
                        destinationDeal
                            ? deal.index >= destinationDeal.index
                            : false
                    )
                    .map(deal =>
                        dataProvider.update('deals', {
                            id: deal.id,
                            data: { index: deal.index + 1 },
                            previousData: deal,
                        })
                    ),
                // change the dragged deal to take the destination index and column
                dataProvider.update('deals', {
                    id: sourceDeal.id,
                    data: {
                        index: destinationDeal
                            ? destinationDeal.index
                            : destinationDeals.pop()!.index + 1,
                        stage: destination.droppableId,
                    },
                    previousData: sourceDeal,
                }),
            ]);

            refresh();
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box display="flex">
                {stages.map(stage => (
                    <DealColumn
                        stage={stage}
                        dealIds={deals[stage]}
                        data={data}
                        key={stage}
                    />
                ))}
            </Box>
        </DragDropContext>
    );
};
