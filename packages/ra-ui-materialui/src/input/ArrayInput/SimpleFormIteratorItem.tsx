import * as React from 'react';
import { ReactElement, ReactNode, useMemo } from 'react';
import { Typography, Stack } from '@mui/material';
import clsx from 'clsx';
import {
    RaRecord,
    RecordContextProvider,
    SourceContextProvider,
    useResourceContext,
    useSourceContext,
} from 'ra-core';

import { SimpleFormIteratorClasses } from './useSimpleFormIteratorStyles';
import { useSimpleFormIterator } from './useSimpleFormIterator';
import { ArrayInputContextValue } from './ArrayInputContext';
import {
    SimpleFormIteratorItemContext,
    SimpleFormIteratorItemContextValue,
} from './SimpleFormIteratorItemContext';
import { RemoveItemButton as DefaultRemoveItemButton } from './RemoveItemButton';
import { ReOrderButtons as DefaultReOrderButtons } from './ReOrderButtons';

export const SimpleFormIteratorItem = React.forwardRef(
    (props: SimpleFormIteratorItemProps, ref: any) => {
        const {
            children,
            disabled,
            disableReordering,
            disableRemove,
            getItemLabel,
            index,
            inline,
            record,
            removeButton = <DefaultRemoveItemButton />,
            reOrderButtons = <DefaultReOrderButtons />,
        } = props;
        const resource = useResourceContext(props);
        if (!resource) {
            throw new Error(
                'SimpleFormIteratorItem must be used in a ResourceContextProvider or be passed a resource prop.'
            );
        }
        const { total, reOrder, remove } = useSimpleFormIterator();
        // Returns a boolean to indicate whether to disable the remove button for certain fields.
        // If disableRemove is a function, then call the function with the current record to
        // determining if the button should be disabled. Otherwise, use a boolean property that
        // enables or disables the button for all of the fields.
        const disableRemoveField = (record: RaRecord) => {
            if (typeof disableRemove === 'boolean') {
                return disableRemove;
            }
            return disableRemove && disableRemove(record);
        };

        const context = useMemo<SimpleFormIteratorItemContextValue>(
            () => ({
                index,
                total,
                reOrder: newIndex => reOrder(index, newIndex),
                remove: () => remove(index),
            }),
            [index, total, reOrder, remove]
        );

        const label =
            typeof getItemLabel === 'function'
                ? getItemLabel(index)
                : getItemLabel;

        const parentSourceContext = useSourceContext();
        const sourceContext = useMemo(
            () => ({
                getSource: (source: string) => {
                    if (!source) {
                        // source can be empty for scalar values, e.g.
                        // <ArrayInput source="tags" /> => SourceContext is "tags"
                        //   <SimpleFormIterator> => SourceContext is "tags.0"
                        //      <TextInput /> => use its parent's getSource so finalSource = "tags.0"
                        //   </SimpleFormIterator>
                        // </ArrayInput>
                        return parentSourceContext.getSource(`${index}`);
                    } else {
                        // Normal input with source, e.g.
                        // <ArrayInput source="orders" /> => SourceContext is "orders"
                        //   <SimpleFormIterator> => SourceContext is "orders.0"
                        //      <DateInput source="date" /> => use its parent's getSource so finalSource = "orders.0.date"
                        //   </SimpleFormIterator>
                        // </ArrayInput>
                        return parentSourceContext.getSource(
                            `${index}.${source}`
                        );
                    }
                },
                getLabel: (source: string) => {
                    // <ArrayInput source="orders" /> => LabelContext is "orders"
                    //   <SimpleFormIterator> => LabelContext is ALSO "orders"
                    //      <DateInput source="date" /> => use its parent's getLabel so finalLabel = "orders.date"
                    //   </SimpleFormIterator>
                    // </ArrayInput>
                    //
                    // we don't prefix with the index to avoid that translation keys contain it
                    return parentSourceContext.getLabel(source);
                },
            }),
            [index, parentSourceContext]
        );

        return (
            <SimpleFormIteratorItemContext.Provider value={context}>
                <li className={SimpleFormIteratorClasses.line} ref={ref}>
                    {label != null && label !== false && (
                        <Typography
                            variant="body2"
                            className={SimpleFormIteratorClasses.index}
                        >
                            {label}
                        </Typography>
                    )}
                    <SourceContextProvider value={sourceContext}>
                        <RecordContextProvider value={record}>
                            <Stack
                                className={clsx(SimpleFormIteratorClasses.form)}
                                direction={
                                    inline
                                        ? { xs: 'column', sm: 'row' }
                                        : 'column'
                                }
                                gap={inline ? 2 : 0}
                            >
                                {children}
                            </Stack>
                        </RecordContextProvider>
                    </SourceContextProvider>
                    {!disabled && (
                        <span className={SimpleFormIteratorClasses.action}>
                            {!disableReordering && reOrderButtons}

                            {!disableRemoveField(record) && removeButton}
                        </span>
                    )}
                </li>
            </SimpleFormIteratorItemContext.Provider>
        );
    }
);

export type DisableRemoveFunction = (record: RaRecord) => boolean;

type GetItemLabelFunc = (index: number) => string | ReactElement;

export type SimpleFormIteratorItemProps = Partial<ArrayInputContextValue> & {
    children?: ReactNode;
    disabled?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: boolean | GetItemLabelFunc;
    index: number;
    inline?: boolean;
    onRemoveField: (index: number) => void;
    onReorder: (origin: number, destination: number) => void;
    record: RaRecord;
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource?: string;
    source?: string;
};
