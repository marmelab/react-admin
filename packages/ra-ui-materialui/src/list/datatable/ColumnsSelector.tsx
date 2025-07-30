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

    const childrenArray = Children.toArray(children);
    const paddedColumnRanks = padRanks(columnRanks ?? [], childrenArray.length);
    const shouldDisplaySearchInput = childrenArray.length > 5;

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
        return index2Pos;
    };

    const list = React.useRef<HTMLUListElement | null>(null);
    const draggedItem = React.useRef<HTMLLIElement | null>(null);
    const dropItem = React.useRef<HTMLLIElement | null>(null);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        // Use setTimeout to let MenuList handle the focus management
        setTimeout(() => {
            if (document.activeElement?.tagName !== 'LI') {
                return;
            }

            if (event.key === ' ') {
                if (!draggedItem.current) {
                    // Start dragging the currently focused item
                    draggedItem.current =
                        document.activeElement as HTMLLIElement;
                    draggedItem.current.classList.add('drag-active-keyboard');
                } else {
                    if (!dropItem.current) {
                        return;
                    }
                    // Drop the dragged item
                    draggedItem.current.classList.remove(
                        'drag-active-keyboard'
                    );
                    const itemToFocusIndex = handleMove(
                        draggedItem.current.dataset.index,
                        dropItem.current?.dataset.index
                    );
                    setTimeout(() => {
                        // We wait for the DOM to update before focusing
                        // the item that was moved.
                        // We use the actual position it was moved to and not the data-index which may not be updated yet
                        if (itemToFocusIndex && list.current) {
                            const itemToFocus =
                                list.current.querySelectorAll('li')[
                                    itemToFocusIndex
                                ];
                            if (itemToFocus) {
                                (itemToFocus as HTMLLIElement).focus();
                            }
                        }
                        draggedItem.current = null;
                    });
                }
            }
            if (!draggedItem.current) {
                return;
            }
            if (event.key === 'ArrowDown') {
                // Swap the dragged item with the next one
                const nextItem = draggedItem.current.nextElementSibling;
                if (nextItem) {
                    draggedItem.current.parentNode?.insertBefore(
                        draggedItem.current,
                        nextItem.nextSibling
                    );
                    dropItem.current = nextItem as HTMLLIElement;
                    draggedItem.current.focus();
                } else {
                    // Start of the list, move the dragged item as the first item
                    draggedItem.current.parentNode?.insertBefore(
                        draggedItem.current,
                        draggedItem.current?.parentNode?.firstChild
                    );
                    dropItem.current = draggedItem.current?.parentNode
                        ?.firstChild as HTMLLIElement;
                    draggedItem.current.focus();
                }
            } else if (event.key === 'ArrowUp') {
                // Swap the dragged item with the previous one
                const prevItem = draggedItem.current.previousElementSibling;
                if (prevItem) {
                    draggedItem.current?.parentNode?.insertBefore(
                        draggedItem.current,
                        prevItem
                    );
                    dropItem.current = prevItem as HTMLLIElement;
                    draggedItem.current.focus();
                } else {
                    // End of the list, move the dragged item as the last item
                    draggedItem.current?.parentNode?.appendChild(
                        draggedItem.current
                    );
                    dropItem.current = draggedItem.current?.parentNode
                        ?.lastChild as HTMLLIElement;
                    draggedItem.current.focus();
                }
            }
        });
    };

    if (!container) return null;

    return createPortal(
        <>
            {shouldDisplaySearchInput ? (
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
                    sx={{ my: 1 }}
                />
            ) : null}
            <MenuList onKeyDown={handleKeyDown} ref={list}>
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
            </MenuList>
            <Box
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
