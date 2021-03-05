import * as React from 'react';
import { Children, FC, ReactElement } from 'react';
import classnames from 'classnames';
import FormInput from './FormInput';
import PropTypes from 'prop-types';
import { FormRenderProps } from 'react-final-form';
import { MutationMode, Record, RedirectionSideEffect } from 'ra-core';
import Toolbar from './Toolbar';
import CardContentInner from '../layout/CardContentInner';

export const SimpleFormView: FC<SimpleFormViewProps> = ({
    basePath,
    children,
    className,
    component: Component,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    margin,
    mutationMode,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    toolbar,
    undoable,
    variant,
    ...rest
}) => (
    <form
        className={classnames('simple-form', className)}
        {...sanitizeRestProps(rest)}
    >
        <Component>
            {Children.map(
                children,
                (input: ReactElement) =>
                    input && (
                        <FormInput
                            basePath={basePath}
                            input={input}
                            record={record}
                            resource={resource}
                            variant={input.props.variant || variant}
                            margin={input.props.margin || margin}
                        />
                    )
            )}
        </Component>
        {toolbar &&
            React.cloneElement(toolbar, {
                basePath,
                handleSubmitWithRedirect,
                handleSubmit,
                invalid,
                mutationMode,
                pristine,
                record,
                redirect,
                resource,
                saving,
                submitOnEnter,
                undoable,
            })}
    </form>
);

SimpleFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    handleSubmit: PropTypes.func, // passed by react-final-form
    invalid: PropTypes.bool,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
};

SimpleFormView.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
    component: CardContentInner,
};

export interface SimpleFormViewProps extends FormRenderProps {
    basePath?: string;
    className?: string;
    component?: React.ComponentType<any>;
    handleSubmitWithRedirect?: (redirectTo: RedirectionSideEffect) => void;
    margin?: 'none' | 'normal' | 'dense';
    mutationMode?: MutationMode;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    save?: () => void;
    saving?: boolean;
    toolbar?: ReactElement;
    /** @deprecated use mutationMode: undoable instead */
    undoable?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    submitOnEnter?: boolean;
    __versions?: any; // react-final-form internal prop, missing in their type
}

const sanitizeRestProps = ({
    active,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    error,
    errors,
    form,
    hasSubmitErrors,
    hasValidationErrors,
    initialValues,
    modified = null,
    modifiedSinceLastSubmit,
    save = null,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touched = null,
    valid,
    validating,
    values,
    visited = null,
    __versions = null,
    ...props
}) => props;
