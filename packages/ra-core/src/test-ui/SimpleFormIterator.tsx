import * as React from 'react';
import { type ReactNode, useCallback, useState } from 'react';
import { type UseFieldArrayReturn } from 'react-hook-form';
import type { RaRecord } from '../types';
import { useTranslate } from '../i18n/useTranslate';
import { Translate } from '../i18n/Translate';
import { useFieldValue } from '../util/useFieldValue';
import { useWrappedSource } from '../core/useWrappedSource';
import { useArrayInput } from '../controller/input/useArrayInput';
import { type ArrayInputContextValue } from '../controller/input/ArrayInputContext';
import { useSimpleFormIterator } from '../controller/input/useSimpleFormIterator';
import { useSimpleFormIteratorItem } from '../controller/input/useSimpleFormIteratorItem';
import { SimpleFormIteratorBase } from '../controller/input/SimpleFormIteratorBase';
import { SimpleFormIteratorItemBase } from '../controller/input/SimpleFormIteratorItemBase';

import { Confirm } from './Confirm';
import { useGetArrayInputNewItemDefaults } from '../controller';
import { useEvent } from '../util';

const DefaultAddItemButton = (
    props: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >
) => {
    const { add, source } = useSimpleFormIterator();
    const { className, ...rest } = props;
    return (
        <button
            type="button"
            onClick={() => add()}
            className={[`button-add button-add-${source}`, className].join(' ')}
            {...rest}
        >
            <Translate i18nKey="ra.action.add">Add</Translate>
        </button>
    );
};

const DefaultRemoveItemButton = (
    props: Omit<
        React.DetailedHTMLProps<
            React.ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
        >,
        'onClick'
    >
) => {
    const { remove, index } = useSimpleFormIteratorItem();
    const { source } = useSimpleFormIterator();
    const { className, ...rest } = props;

    return (
        <button
            type="button"
            onClick={() => remove()}
            className={[
                `button-remove button-remove-${source}-${index}`,
                className,
            ].join(' ')}
            {...rest}
        >
            <Translate i18nKey="ra.action.remove">Remove</Translate>
        </button>
    );
};

const DefaultReOrderButtons = ({ className }: { className?: string }) => {
    const { index, total, reOrder } = useSimpleFormIteratorItem();
    const { source } = useSimpleFormIterator();

    return (
        <span
            className={[
                `button-reorder button-reorder-${source}-${index}`,
                className,
            ].join(' ')}
        >
            <button
                type="button"
                onClick={() => reOrder(index - 1)}
                disabled={index <= 0}
            >
                <Translate i18nKey="ra.action.move_up">Move Up</Translate>
            </button>
            <button
                type="button"
                onClick={() => reOrder(index + 1)}
                disabled={total == null || index >= total - 1}
            >
                <Translate i18nKey="ra.action.move_down">Move Down</Translate>
            </button>
        </span>
    );
};

export type DisableRemoveFunction = (record: RaRecord) => boolean;

export const SimpleFormIteratorItem = React.forwardRef<
    any,
    Partial<ArrayInputContextValue> & {
        children?: ReactNode;
        disabled?: boolean;
        disableRemove?: boolean | DisableRemoveFunction;
        disableReordering?: boolean;
        getItemLabel?: boolean | GetItemLabelFunc;
        index: number;
        inline?: boolean;
        record: RaRecord;
        removeButton?: ReactNode;
        reOrderButtons?: ReactNode;
        resource?: string;
        source?: string;
    }
>(function SimpleFormIteratorItem(props, ref) {
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
        typeof getItemLabel === 'function' ? getItemLabel(index) : getItemLabel;

    return (
        <SimpleFormIteratorItemBase {...props}>
            <li ref={ref}>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                    }}
                >
                    {label != null && label !== false && <span>{label}</span>}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: inline ? 'row' : 'column',
                            gap: '1rem',
                        }}
                    >
                        {children}
                    </div>
                    {!disabled && (
                        <span>
                            {!disableReordering && reOrderButtons}

                            {!disableRemoveField(record) && removeButton}
                        </span>
                    )}
                </div>
                <hr />
            </li>
        </SimpleFormIteratorItemBase>
    );
});

export const SimpleFormIterator = (props: SimpleFormIteratorProps) => {
    const {
        addButton = <DefaultAddItemButton />,
        removeButton,
        reOrderButtons,
        children,
        className,
        resource,
        disabled,
        disableAdd = false,
        disableClear,
        disableRemove = false,
        disableReordering,
        inline,
        getItemLabel = false,
        fullWidth,
    } = props;

    const finalSource = useWrappedSource('');
    if (!finalSource) {
        throw new Error(
            'SimpleFormIterator can only be called within an iterator input like ArrayInput'
        );
    }

    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const { fields, remove } = useArrayInput(props);
    const translate = useTranslate();

    const handleArrayClear = useCallback(() => {
        remove();
        setConfirmIsOpen(false);
    }, [remove]);

    const records = useFieldValue({ source: finalSource });
    const getArrayInputNewItemDefaults =
        useGetArrayInputNewItemDefaults(fields);

    const getItemDefaults = useEvent((item: any = undefined) => {
        if (item != null) return item;
        return getArrayInputNewItemDefaults(children);
    });

    return fields ? (
        <SimpleFormIteratorBase getItemDefaults={getItemDefaults} {...props}>
            <div
                className={[
                    className,
                    fullWidth ? 'fullwidth' : '',
                    disabled ? 'disabled' : '',
                ].join(' ')}
            >
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    {fields.map((member, index) => (
                        <React.Fragment key={member.id}>
                            <SimpleFormIteratorItem
                                disabled={disabled}
                                disableRemove={disableRemove}
                                disableReordering={disableReordering}
                                fields={fields}
                                getItemLabel={getItemLabel}
                                index={index}
                                record={(records && records[index]) || {}}
                                removeButton={removeButton}
                                reOrderButtons={reOrderButtons}
                                resource={resource}
                                inline={inline}
                            >
                                {children}
                            </SimpleFormIteratorItem>
                        </React.Fragment>
                    ))}
                </ul>
                {!disabled &&
                    !(disableAdd && (disableClear || disableRemove)) && (
                        <div
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1rem',
                            }}
                        >
                            {!disableAdd && <div>{addButton}</div>}
                            {fields.length > 0 &&
                                !disableClear &&
                                !disableRemove && (
                                    <div>
                                        <Confirm
                                            isOpen={confirmIsOpen}
                                            title={translate(
                                                'ra.action.clear_array_input'
                                            )}
                                            content={translate(
                                                'ra.message.clear_array_input'
                                            )}
                                            onConfirm={handleArrayClear}
                                            onClose={() =>
                                                setConfirmIsOpen(false)
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmIsOpen(true)
                                            }
                                        >
                                            <Translate i18nKey="ra.action.clear_array_input">
                                                Clear
                                            </Translate>
                                        </button>
                                    </div>
                                )}
                        </div>
                    )}
            </div>
        </SimpleFormIteratorBase>
    ) : null;
};

type GetItemLabelFunc = (index: number) => ReactNode;

export interface SimpleFormIteratorProps extends Partial<UseFieldArrayReturn> {
    addButton?: ReactNode;
    children?: ReactNode;
    className?: string;
    readOnly?: boolean;
    disabled?: boolean;
    disableAdd?: boolean;
    disableClear?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    fullWidth?: boolean;
    getItemLabel?: boolean | GetItemLabelFunc;
    inline?: boolean;
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    record?: RaRecord;
    removeButton?: ReactNode;
    reOrderButtons?: ReactNode;
    resource?: string;
    source?: string;
}
