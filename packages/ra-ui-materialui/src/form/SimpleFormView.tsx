import * as React from 'react';
import { Children, ReactElement, ReactNode } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormWithRedirectRenderProps, MutationMode, Record } from 'ra-core';
import { CardContentInner } from '../layout';
import { Toolbar } from './Toolbar';
import { FormInput } from './FormInput';

export const SimpleFormView = ({
    basePath,
    children,
    className,
    component: Component = CardContentInner,
    handleSubmit,
    handleSubmitWithRedirect,
    margin,
    mutationMode,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter = true,
    toolbar = DefaultToolbar,
    variant,
    ...rest
}: SimpleFormViewProps): ReactElement => (
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
                mutationMode,
                record,
                redirect,
                resource,
                saving,
                submitOnEnter,
            })}
    </form>
);

SimpleFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    handleSubmit: PropTypes.func,
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
    validate: PropTypes.func,
};

const DefaultToolbar = <Toolbar />;

export interface SimpleFormViewProps extends FormWithRedirectRenderProps {
    basePath?: string;
    children?: ReactNode;
    className?: string;
    component?: React.ComponentType<any>;
    margin?: 'none' | 'normal' | 'dense';
    mutationMode?: MutationMode;
    record?: Record;
    resource?: string;
    toolbar?: ReactElement;
    variant?: 'standard' | 'outlined' | 'filled';
    submitOnEnter?: boolean;
}

const sanitizeRestProps = ({
    dirtyFields = null,
    errors = null,
    save = null,
    touched = null,
    isDirty = null,
    isSubmitted = null,
    isSubmitting = null,
    isValid = null,
    submitCount = null,
    __versions = null,
    ...props
}) => props;
