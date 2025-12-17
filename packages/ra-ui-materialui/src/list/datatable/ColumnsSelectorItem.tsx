import * as React from 'react';
import {
    useResourceContext,
    useStore,
    useTranslateLabel,
    useDataTableStoreContext,
    useDataTableColumnRankContext,
    useDataTableColumnFilterContext,
} from 'ra-core';
import * as diacritic from 'diacritic';

import { FieldToggle } from '../../preferences';
import { DataTableColumnProps } from './DataTableColumn';

export const ColumnsSelectorItem = ({
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
    const [columnRanks, setColumnRanks] = useStore<number[]>(
        `${storeKey}_columnRanks`
    );
    const columnFilter = useDataTableColumnFilterContext();
    const translateLabel = useTranslateLabel();
    if (!source && (!label || typeof label !== 'string')) return null;
    const sourceOrLabel = source || (label as string);
    const fieldLabel = translateLabel({
        label: typeof label === 'string' ? label : undefined,
        resource,
        source,
    }) as string;
    const isColumnHidden = hiddenColumns.includes(sourceOrLabel!);
    const isColumnFiltered = fieldLabelMatchesFilter(fieldLabel, columnFilter);

    const handleMove = (index1, index2) => {
        const colRanks = !columnRanks
            ? padRanks([], Math.max(index1, index2) + 1)
            : Math.max(index1, index2) > columnRanks.length - 1
              ? padRanks(columnRanks, Math.max(index1, index2) + 1)
              : columnRanks;
        const index1Pos = colRanks.findIndex(
            // eslint-disable-next-line eqeqeq
            index => index == index1
        );
        const index2Pos = colRanks.findIndex(
            // eslint-disable-next-line eqeqeq
            index => index == index2
        );
        if (index1Pos === -1 || index2Pos === -1) {
            return;
        }
        let newColumnRanks;
        if (index1Pos > index2Pos) {
            newColumnRanks = [
                ...colRanks.slice(0, index2Pos),
                colRanks[index1Pos],
                ...colRanks.slice(index2Pos, index1Pos),
                ...colRanks.slice(index1Pos + 1),
            ];
        } else {
            newColumnRanks = [
                ...colRanks.slice(0, index1Pos),
                ...colRanks.slice(index1Pos + 1, index2Pos + 1),
                colRanks[index1Pos],
                ...colRanks.slice(index2Pos + 1),
            ];
        }
        setColumnRanks(newColumnRanks);
    };

    return isColumnFiltered ? (
        <FieldToggle
            key={columnRank}
            source={sourceOrLabel}
            label={fieldLabel}
            index={String(columnRank)}
            selected={!isColumnHidden}
            onToggle={() =>
                isColumnHidden
                    ? setHiddenColumns(
                          hiddenColumns.filter(
                              column => column !== sourceOrLabel!
                          )
                      )
                    : setHiddenColumns([...hiddenColumns, sourceOrLabel!])
            }
            onMove={handleMove}
        />
    ) : null;
};

const padRanks = (ranks: number[], length: number) =>
    ranks.concat(
        Array.from(
            { length: length - ranks.length },
            (_, i) => ranks.length + i
        )
    );

const fieldLabelMatchesFilter = (fieldLabel: string, columnFilter?: string) =>
    columnFilter
        ? diacritic
              .clean(fieldLabel)
              .toLowerCase()
              .includes(diacritic.clean(columnFilter).toLowerCase())
        : true;
