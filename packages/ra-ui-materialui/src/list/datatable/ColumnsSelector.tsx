import * as React from 'react';
import { Children } from 'react';
import { createPortal } from 'react-dom';
import {
    useStore,
    DataTableColumnRankContext,
    useDataTableStoreContext,
} from 'ra-core';
import { Box } from '@mui/material';

import { Button } from '../../button';

/**
 * Render DataTable.Col elements in the ColumnsButton selector using a React Portal.
 *
 * @see ColumnsButton
 */
export const ColumnsSelector = ({ children }: ColumnsSelectorProps) => {
    const { storeKey, defaultHiddenColumns } = useDataTableStoreContext();
    const [columnRanks, setColumnRanks] = useStore<number[] | undefined>(
        `${storeKey}_columnRanks`
    );
    const [_hiddenColumns, setHiddenColumns] = useStore<string[]>(
        storeKey,
        defaultHiddenColumns
    );
    const elementId = `${storeKey}-columnsSelector`;

    const [container, setContainer] = React.useState<HTMLElement | null>(() =>
        typeof document !== 'undefined'
            ? document.getElementById(elementId)
            : null
    );

    // on first mount, we don't have the container yet, so we wait for it
    React.useEffect(() => {
        if (
            container &&
            typeof document !== 'undefined' &&
            document.body.contains(container)
        )
            return;
        // look for the container in the DOM every 100ms
        const interval = setInterval(() => {
            const target = document.getElementById(elementId);
            if (target) setContainer(target);
        }, 100);
        // stop looking after 500ms
        const timeout = setTimeout(() => clearInterval(interval), 500);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [elementId, container]);

    if (!container) return null;

    const childrenArray = Children.toArray(children);
    const paddedColumnRanks = padRanks(columnRanks ?? [], childrenArray.length);

    return createPortal(
        <>
            {paddedColumnRanks.map((position, index) => (
                <DataTableColumnRankContext.Provider
                    value={position}
                    key={index}
                >
                    {childrenArray[position]}
                </DataTableColumnRankContext.Provider>
            ))}
            <Box
                component="li"
                className="columns-selector-actions"
                sx={{ textAlign: 'center', mt: 1 }}
            >
                <Button
                    onClick={() => {
                        setColumnRanks(undefined);
                        setHiddenColumns(defaultHiddenColumns);
                    }}
                >
                    Reset
                </Button>
            </Box>
        </>,
        container
    );
};

interface ColumnsSelectorProps {
    children?: React.ReactNode;
}

const padRanks = (ranks: number[], length: number) =>
    ranks.concat(
        Array.from(
            { length: length - ranks.length },
            (_, i) => ranks.length + i
        )
    );
