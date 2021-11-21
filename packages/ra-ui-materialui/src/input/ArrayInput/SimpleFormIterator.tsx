import * as React from 'react';
import {
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { FormHelperText, styled } from '@mui/material';
import classNames from 'classnames';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Record, ValidationError } from 'ra-core';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

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
        basePath,
        children,
        className,
        record,
        resource,
        source,
        disabled,
        disableAdd,
        disableRemove,
        disableReordering,
        variant,
        margin,
        TransitionProps,
        defaultValue,
        getItemLabel = DefaultLabelFn,
    } = props;
    const { fields, meta } = useArrayInput(props);
    const { error, submitFailed } = meta;
    const nodeRef = useRef(null);

    // We need a unique id for each field for a proper enter/exit animation
    // so we keep an internal map between the field position and an auto-increment id
    const nextId = useRef(
        fields && fields.length
            ? fields.length
            : defaultValue
            ? defaultValue.length
            : 0
    );

    // We check whether we have a defaultValue (which must be an array) before checking
    // the fields prop which will always be empty for a new record.
    // Without it, our ids wouldn't match the default value and we would get key warnings
    // on the CssTransition element inside our render method
    const ids = useRef(
        nextId.current > 0 ? Array.from(Array(nextId.current).keys()) : []
    );

    const removeField = useCallback(
        (index: number) => {
            ids.current.splice(index, 1);
            fields.remove(index);
        },
        [fields]
    );

    const addField = useCallback(
        (item: any = undefined) => {
            ids.current.push(nextId.current++);
            fields.push(item);
        },
        [fields]
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
            const item = ids.current[origin];
            ids.current[origin] = ids.current[destination];
            ids.current[destination] = item;
            fields.move(origin, destination);
        },
        [fields]
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
                className={classNames(
                    SimpleFormIteratorClasses.root,
                    className
                )}
            >
                {submitFailed && typeof error !== 'object' && error && (
                    <FormHelperText error>
                        <ValidationError error={error as string} />
                    </FormHelperText>
                )}
                <TransitionGroup component={null}>
                    {fields.map((member, index) => (
                        <CSSTransition
                            nodeRef={nodeRef}
                            key={ids.current[index]}
                            timeout={500}
                            classNames="fade"
                            {...TransitionProps}
                        >
                            <SimpleFormIteratorItem
                                basePath={basePath}
                                disabled={disabled}
                                disableRemove={disableRemove}
                                disableReordering={disableReordering}
                                fields={fields}
                                getItemLabel={getItemLabel}
                                index={index}
                                margin={margin}
                                member={member}
                                meta={meta}
                                onRemoveField={removeField}
                                onReorder={handleReorder}
                                record={(records && records[index]) || {}}
                                removeButton={removeButton}
                                reOrderButtons={reOrderButtons}
                                resource={resource}
                                source={source}
                                variant={variant}
                                ref={nodeRef}
                            >
                                {children}
                            </SimpleFormIteratorItem>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                {!disabled && !disableAdd && (
                    <li className={SimpleFormIteratorClasses.line}>
                        <span className={SimpleFormIteratorClasses.action}>
                            {cloneElement(addButton, {
                                onClick: handleAddButtonClick(
                                    addButton.props.onClick
                                ),
                                className: classNames(
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
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    // @ts-ignore
    fields: PropTypes.object,
    meta: PropTypes.object,
    // @ts-ignore
    record: PropTypes.object,
    source: PropTypes.string,
    resource: PropTypes.string,
    translate: PropTypes.func,
    disableAdd: PropTypes.bool,
    disableRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    TransitionProps: PropTypes.shape({}),
};

export interface SimpleFormIteratorProps
    extends Partial<Omit<FieldArrayRenderProps<any, HTMLElement>, 'meta'>> {
    addButton?: ReactElement;
    basePath?: string;
    children?: ReactNode;
    className?: string;
    defaultValue?: any;
    disabled?: boolean;
    disableAdd?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: (index: number) => string;
    margin?: 'none' | 'normal' | 'dense';
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    record?: Record;
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource?: string;
    source?: string;
    TransitionProps?: CSSTransitionProps;
    variant?: 'standard' | 'outlined' | 'filled';
}

const Root = styled('ul')(({ theme }) => ({
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.root}`]: {
        padding: 0,
        marginBottom: 0,
        '& > li:last-child': {
            borderBottom: 'none',
        },
    },
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.line}`]: {
        display: 'flex',
        listStyleType: 'none',
        borderBottom: `solid 1px ${theme.palette.divider}`,
        [theme.breakpoints.down('sm')]: { display: 'block' },
        '&.fade-enter': {
            opacity: 0.01,
            transform: 'translateX(100vw)',
        },
        '&.fade-enter-active': {
            opacity: 1,
            transform: 'translateX(0)',
            transition: 'all 500ms ease-in',
        },
        '&.fade-exit': {
            opacity: 1,
            transform: 'translateX(0)',
        },
        '&.fade-exit-active': {
            opacity: 0.01,
            transform: 'translateX(100vw)',
            transition: 'all 500ms ease-in',
        },
    },
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.index}`]: {
        [theme.breakpoints.down('md')]: { display: 'none' },
        marginRight: theme.spacing(1),
    },
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.indexContainer}`]: {
        display: 'flex',
        paddingTop: '1em',
        marginRight: theme.spacing(1),
        alignItems: 'center',
    },
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.form}`]: {
        flex: 2,
    },
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.action}`]: {
        paddingTop: '0.5em',
    },
    [`${SimpleFormIteratorPrefix} .${SimpleFormIteratorClasses.leftIcon}`]: {
        marginRight: theme.spacing(1),
    },
}));

const DefaultLabelFn = index => index + 1;
