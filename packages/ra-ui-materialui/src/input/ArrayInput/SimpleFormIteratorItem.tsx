import * as React from 'react';
import { type ReactNode, forwardRef, memo } from 'react';
import { Typography, Stack } from '@mui/material';
import clsx from 'clsx';
import {
    SimpleFormIteratorItemBase,
    useRecordContext,
    type RaRecord,
    type SimpleFormIteratorDisableRemoveFunction,
    type SimpleFormIteratorItemBaseProps,
} from 'ra-core';

import { SimpleFormIteratorClasses } from './useSimpleFormIteratorStyles';
import { RemoveItemButton as DefaultRemoveItemButton } from './RemoveItemButton';
import { ReOrderButtons as DefaultReOrderButtons } from './ReOrderButtons';

export const SimpleFormIteratorItem = memo(
    forwardRef<HTMLLIElement, SimpleFormIteratorItemProps>(
        function SimpleFormIteratorItem(props, ref) {
            const {
                children,
                disabled,
                disableReordering,
                disableRemove,
                getItemLabel,
                index,
                inline,
                removeButton = <DefaultRemoveItemButton />,
                reOrderButtons = <DefaultReOrderButtons />,
            } = props;

            const record = useRecordContext(props);
            if (!record) {
                throw new Error(
                    'SimpleFormIteratorItem must be used in a RecordContextProvider.'
                );
            }

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

            const label =
                typeof getItemLabel === 'function'
                    ? getItemLabel(index)
                    : getItemLabel;

            return (
                <SimpleFormIteratorItemBase {...props}>
                    <li className={SimpleFormIteratorClasses.line} ref={ref}>
                        {label != null && label !== false && (
                            <Typography
                                variant="body2"
                                className={SimpleFormIteratorClasses.index}
                            >
                                {label}
                            </Typography>
                        )}
                        <Stack
                            className={clsx(SimpleFormIteratorClasses.form)}
                            direction={
                                inline ? { xs: 'column', sm: 'row' } : 'column'
                            }
                            sx={{
                                gap: inline ? 2 : 0,
                            }}
                        >
                            {children}
                        </Stack>
                        {!disabled && (
                            <span className={SimpleFormIteratorClasses.action}>
                                {!disableReordering && reOrderButtons}

                                {!disableRemoveField(record) && removeButton}
                            </span>
                        )}
                    </li>
                </SimpleFormIteratorItemBase>
            );
        }
    )
);

export type SimpleFormIteratorGetItemLabelFunc = (
    index: number
) => string | ReactNode;

export interface SimpleFormIteratorItemProps
    extends SimpleFormIteratorItemBaseProps {
    children?: ReactNode;
    disabled?: boolean;
    disableRemove?: boolean | SimpleFormIteratorDisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: boolean | SimpleFormIteratorGetItemLabelFunc;
    inline?: boolean;
    // @deprecated Use useSimpleFormIteratorItem().remove instead
    onRemoveField?: (index: number) => void;
    // @deprecated Use useSimpleFormIteratorItem().reOrder instead
    onReorder?: (origin: number, destination: number) => void;
    removeButton?: ReactNode;
    reOrderButtons?: ReactNode;
}
