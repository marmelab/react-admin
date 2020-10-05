import * as React from 'react';
import {
    Children,
    FC,
    ReactElement,
    ReactNode,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    FormWithRedirect,
    FormWithRedirectProps,
    Record,
    RedirectionSideEffect,
} from 'ra-core';
import { FormRenderProps } from 'react-final-form';

import FormInput from './FormInput';
import Toolbar from './Toolbar';
import CardContentInner from '../layout/CardContentInner';

/**
 * Form with a one column layout, one input per line.
 *
 * Pass input components as children.
 *
 * @example
 *
 * import * as React from "react";
 * import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton } from 'react-admin';
 * import RichTextInput from 'ra-input-rich-text';
 *
 * export const PostCreate = (props) => (
 *     <Create {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *             <TextInput source="teaser" options={{ multiLine: true }} />
 *             <RichTextInput source="body" />
 *             <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} children Input elements
 * @prop {Object} initialValues
 * @prop {Function} validate
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 * @prop {string} variant Apply variant to all inputs. Possible values are 'standard', 'outlined', and 'filled' (default)
 * @prop {string} margin Apply variant to all inputs. Possible values are 'none', 'normal', and 'dense' (default)
 * @prop {boolean} sanitizeEmptyValues Whether or not deleted record attributes should be recreated with a `null` value (default: true)
 *
 * @param {Prop} props
 */
const SimpleForm: FC<SimpleFormProps> = props => (
    <FormWithRedirect
        {...props}
        render={formProps => <SimpleFormView {...formProps} />}
    />
);

SimpleForm.propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    // @ts-ignore
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
    version: PropTypes.number,
    sanitizeEmptyValues: PropTypes.bool,
};

export interface SimpleFormProps
    extends Omit<FormWithRedirectProps, 'render'>,
        Omit<
            HtmlHTMLAttributes<HTMLFormElement>,
            'defaultValue' | 'onSubmit' | 'children'
        > {
    basePath?: string;
    children: ReactNode;
    className?: string;
    initialValues?: any;
    margin?: 'none' | 'normal' | 'dense';
    resource?: string;
    submitOnEnter?: boolean;
    toolbar?: ReactElement;
    undoable?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
}

const SimpleFormView: FC<SimpleFormViewProps> = ({
    basePath,
    children,
    className,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    margin,
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
        <CardContentInner>
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
        </CardContentInner>
        {toolbar &&
            React.cloneElement(toolbar, {
                basePath,
                handleSubmitWithRedirect,
                handleSubmit,
                invalid,
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

export interface SimpleFormViewProps extends FormRenderProps {
    basePath?: string;
    className?: string;
    margin?: 'none' | 'normal' | 'dense';
    handleSubmitWithRedirect?: (redirectTo: RedirectionSideEffect) => void;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    save?: () => void;
    saving?: boolean;
    toolbar?: ReactElement;
    undoable?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    submitOnEnter?: boolean;
    __versions?: any; // react-final-form internal prop, missing in their type
}

SimpleFormView.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

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

export default SimpleForm;
