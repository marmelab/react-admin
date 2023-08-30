import * as React from 'react';
import {
    Children,
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { styled, SxProps } from '@mui/material';
import clsx from 'clsx';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
    FormDataConsumer,
    RaRecord,
    useRecordContext,
    useTranslate,
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
import { RemoveItemButton as DefaultRemoveItemButton } from './RemoveItemButton';
import { ReOrderButtons as DefaultReOrderButtons } from './ReOrderButtons';
import { ClearArrayButton } from './ClearArrayButton';
import { Confirm } from '../../layout';

export const SimpleFormIterator = (props: SimpleFormIteratorProps) => {
    const {
        addButton = <DefaultAddItemButton />,
        removeButton = <DefaultRemoveItemButton />,
        reOrderButtons = <DefaultReOrderButtons />,
        children,
        className,
        resource,
        source,
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
    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const { append, fields, move, remove, replace } = useArrayInput(props);
    const { resetField } = useFormContext();
    const translate = useTranslate();
    const record = useRecordContext(props);
    const initialDefaultValue = useRef({});

    const removeField = useCallback(
        (index: number) => {
            remove(index);
        },
        [remove]
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
                    Children.map(
                        children,
                        input =>
                            React.isValidElement(input) &&
                            input.type !== FormDataConsumer
                    ).some(Boolean)
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
            resetField(`${source}.${fields.length}`, { defaultValue });
        },
        [append, children, resetField, source, fields.length]
    );

    // add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = (
        originalOnClickHandler: MouseEventHandler
    ) => (event: MouseEvent) => {
        addField();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

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

    const records = get(record, source);

    const context = useMemo(
        () => ({
            total: fields.length,
            add: addField,
            remove: removeField,
            reOrder: handleReorder,
            source,
        }),
        [addField, fields.length, handleReorder, removeField, source]
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
                            member={`${source}.${index}`}
                            onRemoveField={removeField}
                            onReorder={handleReorder}
                            record={(records && records[index]) || {}}
                            removeButton={removeButton}
                            reOrderButtons={reOrderButtons}
                            resource={resource}
                            source={source}
                            inline={inline}
                        >
                            {children}
                        </SimpleFormIteratorItem>
                    ))}
                </ul>
                {!disabled && !(disableAdd && (disableClear || disableRemove)) && (
                    <div className={SimpleFormIteratorClasses.buttons}>
                        {!disableAdd && (
                            <div className={SimpleFormIteratorClasses.add}>
                                {cloneElement(addButton, {
                                    className: clsx(
                                        'button-add',
                                        `button-add-${source}`
                                    ),
                                    onClick: handleAddButtonClick(
                                        addButton.props.onClick
                                    ),
                                })}
                            </div>
                        )}
                        {fields.length > 0 && !disableClear && !disableRemove && (
                            <div className={SimpleFormIteratorClasses.clear}>
                                <Confirm
                                    isOpen={confirmIsOpen}
                                    title={translate(
                                        'ra.action.clear_array_input'
                                    )}
                                    content={translate(
                                        'ra.message.clear_array_input'
                                    )}
                                    onConfirm={handleArrayClear}
                                    onClose={() => setConfirmIsOpen(false)}
                                />
                                <ClearArrayButton
                                    onClick={() => setConfirmIsOpen(true)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Root>
        </SimpleFormIteratorContext.Provider>
    ) : null;
};

SimpleFormIterator.propTypes = {
    addButton: PropTypes.element,
    removeButton: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    field: PropTypes.object,
    fields: PropTypes.array,
    fieldState: PropTypes.object,
    formState: PropTypes.object,
    fullWidth: PropTypes.bool,
    inline: PropTypes.bool,
    record: PropTypes.object,
    source: PropTypes.string,
    resource: PropTypes.string,
    translate: PropTypes.func,
    disableAdd: PropTypes.bool,
    disableRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    TransitionProps: PropTypes.shape({}),
};

type GetItemLabelFunc = (index: number) => string | ReactElement;

export interface SimpleFormIteratorProps extends Partial<UseFieldArrayReturn> {
    addButton?: ReactElement;
    children?: ReactNode;
    className?: string;
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
    [`& .${SimpleFormIteratorClasses.form}`]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
    },
    [`&.fullwidth > ul > li > .${SimpleFormIteratorClasses.form}`]: {
        flex: 2,
    },
    [`& .${SimpleFormIteratorClasses.inline}`]: {
        flexDirection: 'row',
        columnGap: '1em',
        flexWrap: 'wrap',
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
    [`& .${SimpleFormIteratorClasses.line}:hover > .${SimpleFormIteratorClasses.action}`]: {
        visibility: 'visible',
    },
}));
