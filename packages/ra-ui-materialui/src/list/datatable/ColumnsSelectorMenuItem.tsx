import * as React from 'react';
import { useResourceContext, useStore, useTranslateLabel } from 'ra-core';

import { FieldToggle } from '../../preferences';
import { DataTableColumnProps } from './DataTableColumn';
import { useDataTableStoreContext } from './context/DataTableStoreContext';
import { useDataTableColumnRankContext } from './context/DataTableColumnRankContext';

export const ColumnsSelectorMenuItem = ({
    source,
    label,
}: DataTableColumnProps) => {
    const resource = useResourceContext();
    const { storeKey, defaultHiddenColumns } = useDataTableStoreContext();
    const [hiddenColumns, setHiddenColumns] = useStore<string[]>(
        storeKey,
        defaultHiddenColumns
    );
    const columnRank = useDataTableColumnRankContext();
    const [columnRanks, setColumnRanks] = useStore<Record<number, number>>(
        `${storeKey}.columnRanks`
    );
    const translateLabel = useTranslateLabel();
    if (!source && !label) return null;
    const fieldLabel = translateLabel({
        label: typeof label === 'string' ? label : undefined,
        resource,
        source,
    });
    const isColumnHidden = hiddenColumns.includes(source!);

    const handleMove = (index1, index2) => {
        setColumnRanks((ranks = {}) => {
            const index1Rank = ranks[index1] ?? index1;
            const index2Rank = ranks[index2] ?? index2;
            if (index1Rank === index2Rank) {
                return ranks;
            }
            return {
                ...ranks,
                [Number(index2Rank)]: Number(index1),
                [Number(index1Rank)]: Number(index2),
            };
        });
    };

    console.log(columnRanks);

    return (
        <FieldToggle
            key={columnRank}
            source={source}
            label={fieldLabel}
            index={columnRank}
            selected={!isColumnHidden}
            onToggle={() =>
                isColumnHidden
                    ? setHiddenColumns(
                          hiddenColumns.filter(column => column !== source!)
                      )
                    : setHiddenColumns([...hiddenColumns, source!])
            }
            onMove={handleMove}
        />
    );
};
