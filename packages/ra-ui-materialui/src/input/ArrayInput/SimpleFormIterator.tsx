import * as React from 'react';
import {
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';
import { styled } from '@mui/material';
import clsx from 'clsx';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { RaRecord } from 'ra-core';
import { UseFieldArrayReturn } from 'react-hook-form';
import { AnimatePresence, Reorder } from 'framer-motion';

import { useArrayInput } from './useArrayInput';
import { SimpleFormIteratorClasses } from './useSimpleFormIteratorStyles';
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
        record,
        resource,
        source,
        disabled,
        disableAdd,
        disableRemove,
        disableReordering,
        getItemLabel = DefaultLabelFn,
    } = props;
    const { append, fields, move, remove } = useArrayInput(props);

    const removeField = useCallback(
        (index: number) => {
            remove(index);
        },
        [remove]
    );

    const addField = useCallback(
        (item: any = undefined) => {
            append(item);
        },
        [append]
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

    const handleNewOrder = useCallback(
        (newOrder: RaRecord[]) => {
            let hasMoved = false;
            newOrder.forEach((toField, to) => {
                if (hasMoved) {
                    return;
                }
                const from = fields.findIndex(field => field.id === toField.id);
                if (from !== to) {
                    move(from, to);
                    hasMoved = true;
                }
            });
        },
        [move, fields]
    );

    const records = get(record, source);

    const context = useMemo(
        () => ({
            total: fields.length,
            add: addField,
            remove: removeField,
            reOrder: handleReorder,
        }),
        [fields.length, addField, removeField, handleReorder]
    );
    return fields ? (
        <SimpleFormIteratorContext.Provider value={context}>
            <Root
                className={className}
                as={Reorder.Group}
                values={fields}
                onReorder={handleNewOrder}
            >
                <AnimatePresence initial={false}>
                    {fields.map((field, index) => (
                        <SimpleFormIteratorItem
                            key={field.id}
                            disabled={disabled}
                            disableRemove={disableRemove}
                            disableReordering={disableReordering}
                            fields={fields}
                            field={field}
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
                        >
                            {children}
                        </SimpleFormIteratorItem>
                    ))}
                </AnimatePresence>
                {!disabled && !disableAdd && (
                    <li className={SimpleFormIteratorClasses.line}>
                        <span className={SimpleFormIteratorClasses.action}>
                            {cloneElement(addButton, {
                                onClick: handleAddButtonClick(
                                    addButton.props.onClick
                                ),
                                className: clsx(
                                    'button-add',
                                    `button-add-${source}`
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
    defaultValue: PropTypes.any,
    addButton: PropTypes.element,
    removeButton: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    field: PropTypes.object,
    fields: PropTypes.array,
    fieldState: PropTypes.object,
    formState: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string,
    resource: PropTypes.string,
    translate: PropTypes.func,
    disableAdd: PropTypes.bool,
    disableRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    TransitionProps: PropTypes.shape({}),
};

export interface SimpleFormIteratorProps extends Partial<UseFieldArrayReturn> {
    addButton?: ReactElement;
    children?: ReactNode;
    className?: string;
    defaultValue?: any;
    disabled?: boolean;
    disableAdd?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: (index: number) => string;
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
}

const Root = styled('ul')<
    Omit<React.ComponentProps<typeof Reorder.Group>, 'as'>
>(({ theme }) => ({
    padding: 0,
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
        paddingTop: '1em',
        marginRight: theme.spacing(1),
        alignItems: 'center',
    },
    [`& .${SimpleFormIteratorClasses.form}`]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        flex: 2,
    },
    [`& .${SimpleFormIteratorClasses.action}`]: {
        paddingTop: '0.5em',
    },
    [`& .${SimpleFormIteratorClasses.leftIcon}`]: {
        marginRight: theme.spacing(1),
    },
}));

const DefaultLabelFn = index => index + 1;
