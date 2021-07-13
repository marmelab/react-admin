import * as React from 'react';
import {
    Children,
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    isValidElement,
    ReactElement,
    ReactNode,
    useRef,
} from 'react';
import { Button, FormHelperText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import classNames from 'classnames';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Record, useTranslate, ValidationError } from 'ra-core';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { ClassesOverride } from '../types';
import { IconButtonWithTooltip } from '../button';
import FormInput from './FormInput';

export const SimpleFormIterator = (props: SimpleFormIteratorProps) => {
    const {
        addButton = <DefaultAddButton />,
        removeButton = <DefaultRemoveButton />,
        reOrderButtons = <DefaultReOrderButtons />,
        basePath,
        children,
        className,
        fields,
        meta: { error, submitFailed },
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
    const classes = useStyles(props);
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

    const removeField = (index: number) => () => {
        ids.current.splice(index, 1);
        fields?.remove(index);
    };

    // Returns a boolean to indicate whether to disable the remove button for certain fields.
    // If disableRemove is a function, then call the function with the current record to
    // determining if the button should be disabled. Otherwise, use a boolean property that
    // enables or disables the button for all of the fields.
    const disableRemoveField = (
        record: Record,
        disableRemove: boolean | DisableRemoveFunction
    ) => {
        if (typeof disableRemove === 'boolean') {
            return disableRemove;
        }
        return disableRemove && disableRemove(record);
    };

    const addField = () => {
        ids.current.push(nextId.current++);
        fields?.push(undefined);
    };

    // add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = (
        originalOnClickHandler: MouseEventHandler
    ) => (event: MouseEvent) => {
        addField();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

    // remove field and call the onClick event of the button passed as removeButton prop
    const handleRemoveButtonClick = (
        originalOnClickHandler: MouseEventHandler,
        index: number
    ) => (event: MouseEvent) => {
        removeField(index)();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

    const handleReorder = (origin: number, destination: number) => {
        const item = ids.current[origin];
        ids.current[origin] = ids.current[destination];
        ids.current[destination] = item;
        fields?.move(origin, destination);
    };

    const records = get(record, source);
    return fields ? (
        <ul className={classNames(classes.root, className)}>
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
                        <li className={classes.line}>
                            <div>
                                <div className={classes.indexContainer}>
                                    <Typography
                                        variant="body1"
                                        className={classes.index}
                                    >
                                        {getItemLabel(index)}
                                    </Typography>
                                    {!disabled &&
                                        !disableReordering &&
                                        cloneElement(reOrderButtons, {
                                            index,
                                            max: fields.length,
                                            onReorder: handleReorder,
                                            className: classNames(
                                                'button-reorder',
                                                `button-reorder-${source}-${index}`
                                            ),
                                        })}
                                </div>
                            </div>
                            <section className={classes.form}>
                                {Children.map(
                                    children,
                                    (input: ReactElement, index2) => {
                                        if (!isValidElement<any>(input)) {
                                            return null;
                                        }
                                        const {
                                            source,
                                            ...inputProps
                                        } = input.props;
                                        return (
                                            <FormInput
                                                basePath={
                                                    input.props.basePath ||
                                                    basePath
                                                }
                                                input={cloneElement(input, {
                                                    source: source
                                                        ? `${member}.${source}`
                                                        : member,
                                                    index: source
                                                        ? undefined
                                                        : index2,
                                                    label:
                                                        typeof input.props
                                                            .label ===
                                                        'undefined'
                                                            ? source
                                                                ? `resources.${resource}.fields.${source}`
                                                                : undefined
                                                            : input.props.label,
                                                    disabled,
                                                    ...inputProps,
                                                })}
                                                record={
                                                    (records &&
                                                        records[index]) ||
                                                    {}
                                                }
                                                resource={resource}
                                                variant={variant}
                                                margin={margin}
                                            />
                                        );
                                    }
                                )}
                            </section>
                            {!disabled &&
                                !disableRemoveField(
                                    (records && records[index]) || {},
                                    disableRemove
                                ) && (
                                    <span className={classes.action}>
                                        {cloneElement(removeButton, {
                                            onClick: handleRemoveButtonClick(
                                                removeButton.props.onClick,
                                                index
                                            ),
                                            className: classNames(
                                                'button-remove',
                                                `button-remove-${source}-${index}`
                                            ),
                                        })}
                                    </span>
                                )}
                        </li>
                    </CSSTransition>
                ))}
            </TransitionGroup>
            {!disabled && !disableAdd && (
                <li className={classes.line}>
                    <span className={classes.action}>
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
        </ul>
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
    classes: PropTypes.object,
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

type DisableRemoveFunction = (record: Record) => boolean;

export interface SimpleFormIteratorProps
    extends Partial<Omit<FieldArrayRenderProps<any, HTMLElement>, 'meta'>> {
    addButton?: ReactElement;
    basePath?: string;
    children?: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
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
    TransitionProps?: any;
    variant?: 'standard' | 'outlined' | 'filled';
}

const useStyles = makeStyles(
    theme => ({
        root: {
            padding: 0,
            marginBottom: 0,
            '& > li:last-child': {
                borderBottom: 'none',
            },
        },
        line: {
            display: 'flex',
            listStyleType: 'none',
            borderBottom: `solid 1px ${theme.palette.divider}`,
            [theme.breakpoints.down('xs')]: { display: 'block' },
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
        index: {
            [theme.breakpoints.down('sm')]: { display: 'none' },
            marginRight: theme.spacing(1),
        },
        indexContainer: {
            display: 'flex',
            paddingTop: '1em',
            marginRight: theme.spacing(1),
            alignItems: 'center',
        },
        form: { flex: 2 },
        action: {
            paddingTop: '0.5em',
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'RaSimpleFormIterator' }
);

const DefaultAddButton = props => {
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <Button size="small" {...props}>
            <AddIcon className={classes.leftIcon} />
            {translate('ra.action.add')}
        </Button>
    );
};

const DefaultLabelFn = index => index + 1;

const DefaultRemoveButton = props => {
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <Button size="small" {...props}>
            <CloseIcon className={classes.leftIcon} />
            {translate('ra.action.remove')}
        </Button>
    );
};

const DefaultReOrderButtons = ({
    className,
    index,
    max,
    onReorder,
}: {
    className?: string;
    index?: number;
    max?: number;
    onReorder?: (origin: number, destination: number) => void;
}) => (
    <div className={className}>
        <IconButtonWithTooltip
            label="ra.action.move_up"
            size="small"
            onClick={() => onReorder(index, index - 1)}
            disabled={index <= 0}
        >
            <ArrowUpwardIcon />
        </IconButtonWithTooltip>
        <IconButtonWithTooltip
            label="ra.action.move_down"
            size="small"
            onClick={() => onReorder(index, index + 1)}
            disabled={max == null || index >= max - 1}
        >
            <ArrowDownwardIcon />
        </IconButtonWithTooltip>
    </div>
);
