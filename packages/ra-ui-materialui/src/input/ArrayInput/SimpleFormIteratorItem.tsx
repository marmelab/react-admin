import * as React from 'react';
import {
    Children,
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    isValidElement,
    ReactElement,
    ReactNode,
    useMemo,
} from 'react';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import { RaRecord } from 'ra-core';
import { Reorder } from 'framer-motion';

import { SimpleFormIteratorClasses } from './useSimpleFormIteratorStyles';
import { useSimpleFormIterator } from './useSimpleFormIterator';
import { ArrayInputContextValue } from './ArrayInputContext';
import {
    SimpleFormIteratorItemContext,
    SimpleFormIteratorItemContextValue,
} from './SimpleFormIteratorItemContext';

export const SimpleFormIteratorItem = (props: SimpleFormIteratorItemProps) => {
    const {
        children,
        disabled,
        disableReordering,
        disableRemove,
        field,
        getItemLabel,
        index,
        member,
        record,
        removeButton,
        reOrderButtons,
        resource,
        source,
    } = props;

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

    return (
        <SimpleFormIteratorItemContext.Provider value={context}>
            <Reorder.Item
                className={SimpleFormIteratorClasses.line}
                value={field}
                initial={{ opacity: 0.01, x: '50%' }}
                animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: 'easeIn' },
                }}
                exit={{ opacity: 0.01, x: '50%' }}
            >
                <div>
                    <div className={SimpleFormIteratorClasses.indexContainer}>
                        <Typography
                            variant="body1"
                            className={SimpleFormIteratorClasses.index}
                        >
                            {getItemLabel(index)}
                        </Typography>
                        {!disabled &&
                            !disableReordering &&
                            cloneElement(reOrderButtons, {
                                index,
                                max: total,
                                reOrder,
                                className: clsx(
                                    'button-reorder',
                                    `button-reorder-${source}-${index}`
                                ),
                            })}
                    </div>
                </div>
                <section className={SimpleFormIteratorClasses.form}>
                    {Children.map(children, (input: ReactElement, index2) => {
                        if (!isValidElement<any>(input)) {
                            return null;
                        }
                        const { source, ...inputProps } = input.props;
                        return cloneElement(input, {
                            source: source ? `${member}.${source}` : member,
                            index: source ? undefined : index2,
                            label:
                                typeof input.props.label === 'undefined'
                                    ? source
                                        ? `resources.${resource}.fields.${source}`
                                        : undefined
                                    : input.props.label,
                            disabled,
                            ...inputProps,
                        });
                    })}
                </section>
                {!disabled && !disableRemoveField(record) && (
                    <span className={SimpleFormIteratorClasses.action}>
                        {cloneElement(removeButton, {
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
            </Reorder.Item>
        </SimpleFormIteratorItemContext.Provider>
    );
};

export type DisableRemoveFunction = (record: RaRecord) => boolean;

export type SimpleFormIteratorItemProps = Partial<ArrayInputContextValue> & {
    children?: ReactNode;
    disabled?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: (index: number) => string;
    index: number;
    field: RaRecord;
    member: string;
    onRemoveField: (index: number) => void;
    onReorder: (origin: number, destination: number) => void;
    record: RaRecord;
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource: string;
    source: string;
};
