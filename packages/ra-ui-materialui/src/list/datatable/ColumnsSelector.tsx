import * as React from 'react';
import { Children } from 'react';
import { createPortal } from 'react-dom';
import {
    useStore,
    DataTableColumnRankContext,
    useDataTableStoreContext,
    useTranslate,
    DataTableColumnFilterContext,
} from 'ra-core';
import { Box, InputAdornment, MenuList } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { Button } from '../../button';
import { ResettableTextField } from '../../input/ResettableTextField';

/**
 * Render DataTable.Col elements in the ColumnsButton selector using a React Portal.
 *
 * @see ColumnsButton
 */
export const ColumnsSelector = ({ children }: ColumnsSelectorProps) => {
    const translate = useTranslate();
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

    const [columnFilter, setColumnFilter] = React.useState<string>('');

    if (!container) return null;

    const childrenArray = Children.toArray(children);
    const paddedColumnRanks = padRanks(columnRanks ?? [], childrenArray.length);
    const shouldDisplaySearchInput = childrenArray.length > 5;

    return createPortal(
        <MenuList>
            {shouldDisplaySearchInput ? (
                <Box component="li" tabIndex={-1}>
                    <ResettableTextField
                        hiddenLabel
                        label=""
                        value={columnFilter}
                        onChange={e => {
                            if (typeof e === 'string') {
                                setColumnFilter(e);
                                return;
                            }
                            setColumnFilter(e.target.value);
                        }}
                        placeholder={translate('ra.action.search_columns', {
                            _: 'Search columns',
                        })}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                        resettable
                        autoFocus
                        size="small"
                        sx={{ mb: 1 }}
                    />
                </Box>
            ) : null}
            {paddedColumnRanks.map((position, index) => (
                <DataTableColumnRankContext.Provider
                    value={position}
                    key={index}
                >
                    <DataTableColumnFilterContext.Provider
                        value={columnFilter}
                        key={index}
                    >
                        {childrenArray[position]}
                    </DataTableColumnFilterContext.Provider>
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
                    label={translate('ra.action.reset', {
                        _: 'Reset',
                    })}
                />
            </Box>
        </MenuList>,
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
