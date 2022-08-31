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
} from 'react';
import { styled, SxProps } from '@mui/material';
import clsx from 'clsx';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { FormDataConsumer, RaRecord, useRecordContext } from 'ra-core';
import { UseFieldArrayReturn } from 'react-hook-form';

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
        disableAdd,
        disableRemove,
        disableReordering,
        inline,
        getItemLabel = DefaultLabelFn,
        sx,
    } = props;
    const { append, fields, move, remove } = useArrayInput(props);
    const record = useRecordContext(props);

    const removeField = useCallback(
        (index: number) => {
            remove(index);
        },
        [remove]
    );

    const addField = useCallback(
        (item: any = undefined) => {
            let defaultValue = item;
            if (item == null) {
                if (
                    Children.count(children) === 1 &&
                    React.isValidElement(Children.only(children)) &&
                    // @ts-ignore
                    !Children.only(children).props.source
                ) {
                    // ArrayInput used for an array of scalar values
                    // (e.g. tags: ['foo', 'bar'])
                    defaultValue = '';
                } else {
                    // ArrayInput used for an array of objects
                    // (e.g. authors: [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Doe' }])
                    defaultValue = {} as Record<string, unknown>;
                    Children.forEach(children, input => {
                        if (
                            React.isValidElement(input) &&
                            input.type !== FormDataConsumer
                        ) {
                            defaultValue[input.props.source] =
                                input.props.defaultValue ?? '';
                        }
                    });
                }
            }
            append(defaultValue);
        },
        [append, children]
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
            <Root className={className} sx={sx}>
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
                {!disabled && !disableAdd && (
                    <li className={SimpleFormIteratorClasses.line}>
                        {fields.length > 0 && (
                            <span
                                className={SimpleFormIteratorClasses.form}
                            ></span>
                        )}
                        <span className={SimpleFormIteratorClasses.action}>
                            {cloneElement(addButton, {
                                className: clsx(
                                    'button-add',
                                    `button-add-${source}`
                                ),
                                onClick: handleAddButtonClick(
                                    addButton.props.onClick
                                ),
                            })}
                        </span>
                    </li>
                )}
            </Root>
        </SimpleFormIteratorContext.Provider>
    ) : null;
};

SimpleFormIterator.defaultProps = {
    disableAdd: false,
    disableRemove: false,
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
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
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

const Root = styled('ul', {
    name: SimpleFormIteratorPrefix,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    '& > li:last-child': {
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.line}`]: {
        display: 'flex',
        listStyleType: 'none',
        borderBottom: `solid 1px ${theme.palette.divider}`,
        [theme.breakpoints.down('sm')]: { display: 'block' },
    },
    [`& .${SimpleFormIteratorClasses.index}`]: {
        [theme.breakpoints.down('md')]: { display: 'none' },
        marginRight: theme.spacing(1),
    },
    [`& .${SimpleFormIteratorClasses.indexContainer}`]: {
        display: 'flex',
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(0.5),
        alignItems: 'top',
    },
    [`& .${SimpleFormIteratorClasses.form}`]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        flex: 2,
    },
    [`& .${SimpleFormIteratorClasses.inline}`]: {
        flexDirection: 'row',
        gap: '1em',
    },
    [`& .${SimpleFormIteratorClasses.action}`]: {
        marginTop: theme.spacing(0.5),
    },
    [`& .${SimpleFormIteratorClasses.leftIcon}`]: {
        marginRight: theme.spacing(1),
    },
}));

const DefaultLabelFn = index => index + 1;
