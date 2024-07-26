import * as React from 'react';
import {
    Children,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { styled, SxProps, useThemeProps } from '@mui/material';
import clsx from 'clsx';
import get from 'lodash/get';
import {
    FormDataConsumer,
    RaRecord,
    useRecordContext,
    useTranslate,
    useWrappedSource,
} from 'ra-core';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';

import { useArrayInput } from './useArrayInput';
import {
    SimpleFormIteratorClasses,
    SimpleFormIteratorPrefix,
} from './useSimpleFormIteratorStyles';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';
import {
    DisableRemoveFunction,
    SimpleFormIteratorItem,
} from './SimpleFormIteratorItem';
import { AddItemButton as DefaultAddItemButton } from './AddItemButton';
import { ClearArrayButton } from './ClearArrayButton';
import { Confirm } from '../../layout';

export const SimpleFormIterator = (inProps: SimpleFormIteratorProps) => {
    const props = useThemeProps({
        props: inProps,
        name: 'RaSimpleFormIterator',
    });
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
        sx,
    } = props;

    const finalSource = useWrappedSource('');
    if (!finalSource) {
        throw new Error(
            'SimpleFormIterator can only be called within an iterator input like ArrayInput'
        );
    }

    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const { append, fields, move, remove, replace } = useArrayInput(props);
    const { resetField, trigger, getValues } = useFormContext();
    const translate = useTranslate();
    const record = useRecordContext(props);
    const initialDefaultValue = useRef({});

    const removeField = useCallback(
        (index: number) => {
            remove(index);
            const isScalarArray = getValues(finalSource).every(
                (value: any) => typeof value !== 'object'
            );
            if (isScalarArray) {
                // Trigger validation on the Array to avoid ghost errors.
                // Otherwise, validation errors on removed fields might still be displayed
                trigger(finalSource);
            }
        },
        [remove, trigger, finalSource, getValues]
    );

    if (fields.length > 0) {
        const { id, ...rest } = fields[0];
        initialDefaultValue.current = rest;
        for (const k in initialDefaultValue.current)
            initialDefaultValue.current[k] = null;
    }

    const addField = useCallback(
        (item: any = undefined) => {
            let defaultValue = item;
            if (item == null) {
                defaultValue = initialDefaultValue.current;
                if (
                    Children.count(children) === 1 &&
                    React.isValidElement(Children.only(children)) &&
                    // @ts-ignore
                    !Children.only(children).props.source &&
                    // Make sure it's not a FormDataConsumer
                    // @ts-ignore
                    !Children.only(children).type !== FormDataConsumer
                ) {
                    // ArrayInput used for an array of scalar values
                    // (e.g. tags: ['foo', 'bar'])
                    defaultValue = '';
                } else {
                    // ArrayInput used for an array of objects
                    // (e.g. authors: [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Doe' }])
                    defaultValue =
                        defaultValue || ({} as Record<string, unknown>);
                    Children.forEach(children, input => {
                        if (
                            React.isValidElement(input) &&
                            input.type !== FormDataConsumer &&
                            input.props.source
                        ) {
                            defaultValue[input.props.source] =
                                input.props.defaultValue ?? null;
                        }
                    });
                }
            }
            append(defaultValue);
            // Make sure the newly added inputs are not considered dirty by react-hook-form
            resetField(`${finalSource}.${fields.length}`, { defaultValue });
        },
        [append, children, resetField, finalSource, fields.length]
    );

    const handleReorder = useCallback(
        (origin: number, destination: number) => {
            move(origin, destination);
        },
        [move]
    );

    const handleArrayClear = useCallback(() => {
        replace([]);
        setConfirmIsOpen(false);
    }, [replace]);

    const records = get(record, finalSource);

    const context = useMemo(
        () => ({
            total: fields.length,
            add: addField,
            remove: removeField,
            reOrder: handleReorder,
            source: finalSource,
        }),
        [addField, fields.length, handleReorder, removeField, finalSource]
    );
    return fields ? (
        <SimpleFormIteratorContext.Provider value={context}>
            <Root
                className={clsx(
                    className,
                    fullWidth && 'fullwidth',
                    disabled && 'disabled'
                )}
                sx={sx}
            >
                <ul className={SimpleFormIteratorClasses.list}>
                    {fields.map((member, index) => (
                        <SimpleFormIteratorItem
                            key={member.id}
                            disabled={disabled}
                            disableRemove={disableRemove}
                            disableReordering={disableReordering}
                            fields={fields}
                            getItemLabel={getItemLabel}
                            index={index}
                            onRemoveField={removeField}
                            onReorder={handleReorder}
                            record={(records && records[index]) || {}}
                            removeButton={removeButton}
                            reOrderButtons={reOrderButtons}
                            resource={resource}
                            inline={inline}
                        >
                            {children}
                        </SimpleFormIteratorItem>
                    ))}
                </ul>
                {!disabled &&
                    !(disableAdd && (disableClear || disableRemove)) && (
                        <div className={SimpleFormIteratorClasses.buttons}>
                            {!disableAdd && (
                                <div className={SimpleFormIteratorClasses.add}>
                                    {addButton}
                                </div>
                            )}
                            {fields.length > 0 &&
                                !disableClear &&
                                !disableRemove && (
                                    <div
                                        className={
                                            SimpleFormIteratorClasses.clear
                                        }
                                    >
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
                                        <ClearArrayButton
                                            onClick={() =>
                                                setConfirmIsOpen(true)
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    )}
            </Root>
        </SimpleFormIteratorContext.Provider>
    ) : null;
};

type GetItemLabelFunc = (index: number) => string | ReactElement;

export interface SimpleFormIteratorProps extends Partial<UseFieldArrayReturn> {
    addButton?: ReactElement;
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
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource?: string;
    source?: string;
    sx?: SxProps;
}

const Root = styled('div', {
    name: SimpleFormIteratorPrefix,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    '& > ul': {
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    '& > ul > li:last-child': {
        // hide the last separator
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.line}`]: {
        display: 'flex',
        listStyleType: 'none',
        borderBottom: `solid 1px ${theme.palette.divider}`,
        [theme.breakpoints.down('sm')]: { display: 'block' },
    },
    [`& .${SimpleFormIteratorClasses.index}`]: {
        display: 'flex',
        alignItems: 'top',
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
        [theme.breakpoints.down('md')]: { display: 'none' },
    },
    [`& .${SimpleFormIteratorClasses.form}`]: {},
    [`&.fullwidth > ul > li > .${SimpleFormIteratorClasses.form}`]: {
        flex: 2,
    },
    [`& .${SimpleFormIteratorClasses.inline}`]: {
        flexDirection: 'row',
        columnGap: '1em',
    },
    [`& .${SimpleFormIteratorClasses.action}`]: {
        marginTop: theme.spacing(0.5),
        visibility: 'hidden',
        '@media(hover:none)': {
            visibility: 'visible',
        },
    },
    [`& .${SimpleFormIteratorClasses.buttons}`]: {
        display: 'flex',
    },
    [`& .${SimpleFormIteratorClasses.add}`]: {
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.clear}`]: {
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.line}:hover > .${SimpleFormIteratorClasses.action}`]:
        {
            visibility: 'visible',
        },
}));
