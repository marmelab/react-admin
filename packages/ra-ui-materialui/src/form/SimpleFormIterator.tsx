import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';
import classNames from 'classnames';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Record, useTranslate, ValidationError } from 'ra-core';
import * as React from 'react';
import {
    Children,
    cloneElement,
    FC,
    isValidElement,
    ReactElement,
    useRef,
} from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ClassesOverride } from '../types';
import FormInput from './FormInput';

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
            width: '3em',
            paddingTop: '1em',
            [theme.breakpoints.down('sm')]: { display: 'none' },
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

const SimpleFormIterator: FC<SimpleFormIteratorProps> = props => {
    const {
        addButton = <DefaultAddButton />,
        removeButton = <DefaultRemoveButton />,
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

    const removeField = index => () => {
        ids.current.splice(index, 1);
        fields.remove(index);
    };

    // Returns a boolean to indicate whether to disable the remove button for certain fields.
    // If disableRemove is a function, then call the function with the current record to
    // determining if the button should be disabled. Otherwise, use a boolean property that
    // enables or disables the button for all of the fields.
    const disableRemoveField = (record, disableRemove) => {
        if (typeof disableRemove === 'boolean') {
            return disableRemove;
        }
        return disableRemove && disableRemove(record);
    };

    const addField = () => {
        ids.current.push(nextId.current++);
        fields.push(undefined);
    };

    // add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = originalOnClickHandler => event => {
        addField();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

    // remove field and call the onClick event of the button passed as removeButton prop
    const handleRemoveButtonClick = (
        originalOnClickHandler,
        index
    ) => event => {
        removeField(index)();
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
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
                            <Typography
                                variant="body1"
                                className={classes.index}
                            >
                                {getItemLabel(index)}
                            </Typography>
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
    classes?: ClassesOverride<typeof useStyles>;
    className?: string;
    defaultValue?: any;
    disabled?: boolean;
    disableAdd?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    getItemLabel?: (index: number) => string;
    margin?: 'none' | 'normal' | 'dense';
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    record?: Record;
    removeButton?: ReactElement;
    resource?: string;
    source?: string;
    TransitionProps?: any;
    variant?: 'standard' | 'outlined' | 'filled';
}

export default SimpleFormIterator;
