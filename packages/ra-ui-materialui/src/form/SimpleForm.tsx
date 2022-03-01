import * as React from 'react';
import { ReactElement, ReactNode, HtmlHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { Form, FormProps, MutationMode } from 'ra-core';
import { SimpleFormView } from './SimpleFormView';

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
 *             <TextInput source="teaser" options={{ multiline: true }} />
 *             <RichTextInput source="body" />
 *             <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} children Input elements
 * @prop {Object} defaultValues
 * @prop {Function} validate
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 *
 * @param {Props} props
 */
export const SimpleForm = (props: SimpleFormProps) => (
    <Form {...props} render={formProps => <SimpleFormView {...formProps} />} />
);

SimpleForm.propTypes = {
    children: PropTypes.node,
    defaultValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
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
    toolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([false])]),
    validate: PropTypes.func,
};

export interface SimpleFormProps
    extends Omit<FormProps, 'render'>,
        Omit<
            HtmlHTMLAttributes<HTMLFormElement>,
            'defaultValue' | 'onSubmit' | 'children'
        > {
    children: ReactNode;
    className?: string;
    component?: React.ComponentType<any>;
    defaultValues?: any;
    mutationMode?: MutationMode;
    resource?: string;
    submitOnEnter?: boolean;
    toolbar?: ReactElement | false;
}
