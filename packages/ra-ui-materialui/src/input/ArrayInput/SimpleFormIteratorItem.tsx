import * as React from 'react';
import {
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useMemo,
} from 'react';
import { Typography, Stack } from '@mui/material';
import clsx from 'clsx';
import {
    getResourceFieldLabelKey,
    RaRecord,
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
            member,
            record,
            removeButton,
            reOrderButtons,
            source,
        } = props;
        const resource = useResourceContext(props);
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

        // remove field and call the onClick event of the button passed as removeButton prop
        const handleRemoveButtonClick = (
            originalOnClickHandler: MouseEventHandler,
            index: number
        ) => (event: MouseEvent) => {
            remove(index);
            if (originalOnClickHandler) {
                originalOnClickHandler(event);
            }
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
                getSource: (source: string) =>
                    source ? `${member}.${source}` : member,
                getLabel: (source: string) => {
                    // remove digits, e.g. 'book.authors.2.categories.3.identifier.name' => 'book.authors.categories.identifier.name'
                    const sanitizedMember = member.replace(/\.\d+/g, '');
                    // source may be empty for scalar values arrays
                    const itemSource = source
                        ? `${sanitizedMember}.${source}`
                        : sanitizedMember;

                    return parentSourceContext
                        ? parentSourceContext.getLabel(itemSource)
                        : getResourceFieldLabelKey(resource, itemSource);
                },
            }),
            [member, parentSourceContext, resource]
        );

        return (
            <SimpleFormIteratorItemContext.Provider value={context}>
                <li className={SimpleFormIteratorClasses.line} ref={ref}>
                    {label && (
                        <Typography
                            variant="body2"
                            className={SimpleFormIteratorClasses.index}
                        >
                            {label}
                        </Typography>
                    )}
                    <SourceContextProvider value={sourceContext}>
                        <Stack
                            className={clsx(SimpleFormIteratorClasses.form)}
                            direction={
                                inline ? { xs: 'column', sm: 'row' } : 'column'
                            }
                            gap={inline ? 2 : 0}
                        >
                            {children}
                        </Stack>
                    </SourceContextProvider>
                    {!disabled && (
                        <span className={SimpleFormIteratorClasses.action}>
                            {!disableReordering &&
                                cloneElement(reOrderButtons, {
                                    index,
                                    max: total,
                                    reOrder,
                                    className: clsx(
                                        'button-reorder',
                                        `button-reorder-${source}-${index}`
                                    ),
                                })}

                            {!disableRemoveField(record) &&
                                cloneElement(removeButton, {
                                    onClick: handleRemoveButtonClick(
                                        removeButton.props.onClick,
                                        index
                                    ),
                                    className: clsx(
                                        'button-remove',
                                        `button-remove-${source}-${index}`
                                    ),
                                })}
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
    member: string;
    onRemoveField: (index: number) => void;
    onReorder: (origin: number, destination: number) => void;
    record: RaRecord;
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource: string;
    source: string;
};
