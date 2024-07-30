import * as React from 'react';
import {
    Children,
    isValidElement,
    ReactElement,
    ReactNode,
    HtmlHTMLAttributes,
} from 'react';
import { Form, FormProps, MutationMode, RaRecord } from 'ra-core';
import get from 'lodash/get';

import { TabbedFormView, TabbedFormViewProps } from './TabbedFormView';
import { useFormRootPath } from './useFormRootPath';
import { FormTab } from './FormTab';

/**
 * Form layout where inputs are divided by tab, one input per line.
 *
 * Pass <TabbedForm.Tab> components as children.
 *
 * @example
 *
 * import * as React from "react";
 * import {
 *     Edit,
 *     TabbedForm,
 *     Datagrid,
 *     TextField,
 *     DateField,
 *     TextInput,
 *     ReferenceManyField,
 *     NumberInput,
 *     DateInput,
 *     BooleanInput,
 *     EditButton
 * } from 'react-admin';
 *
 * export const PostEdit = () => (
 *     <Edit>
 *         <TabbedForm>
 *             <TabbedForm.Tab label="summary">
 *                 <TextInput disabled label="Id" source="id" />
 *                 <TextInput source="title" validate={required()} />
 *                 <TextInput multiline source="teaser" validate={required()} />
 *             </TabbedForm.Tab>
 *             <TabbedForm.Tab label="body">
 *                 <RichTextInput source="body" validate={required()} label={false} />
 *             </TabbedForm.Tab>
 *             <TabbedForm.Tab label="Miscellaneous">
 *                 <TextInput label="Password (if protected post)" source="password" type="password" />
 *                 <DateInput label="Publication date" source="published_at" />
 *                 <NumberInput source="average_note" validate={[ number(), minValue(0) ]} />
 *                 <BooleanInput label="Allow comments?" source="commentable" defaultValue />
 *                 <TextInput disabled label="Nb views" source="views" />
 *             </TabbedForm.Tab>
 *             <TabbedForm.Tab label="comments">
 *                 <ReferenceManyField reference="comments" target="post_id" label={false}>
 *                     <Datagrid>
 *                         <TextField source="body" />
 *                         <DateField source="created_at" />
 *                         <EditButton />
 *                     </Datagrid>
 *                 </ReferenceManyField>
 *             </TabbedForm.Tab>
 *         </TabbedForm>
 *     </Edit>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} FormTab elements
 * @prop {Object} defaultValues
 * @prop {Function} validate
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 *
 * @param {Props} props
 */
export const TabbedForm = (props: TabbedFormProps) => {
    const formRootPathname = useFormRootPath();

    return (
        <Form formRootPathname={formRootPathname} {...props}>
            <TabbedFormView
                formRootPathname={formRootPathname}
                {...sanitizeRestProps(props)}
            />
        </Form>
    );
};

TabbedForm.Tab = FormTab;

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    criteriaMode,
    defaultValues,
    delayError,
    formRootPathname,
    mode,
    noValidate,
    onSubmit,
    record,
    resetOptions,
    resolver,
    reValidateMode,
    sanitizeEmptyValues,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    validate,
    warnWhenUnsavedChanges,
    ...rest
}: TabbedFormProps) => rest;
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface TabbedFormProps
    extends Omit<FormProps, 'render'>,
        Omit<
            HtmlHTMLAttributes<HTMLFormElement>,
            'defaultValue' | 'onSubmit' | 'children'
        >,
        Partial<TabbedFormViewProps> {
    children: ReactNode;
    className?: string;
    defaultValues?: any;
    formRootPathname?: string;
    mutationMode?: MutationMode;
    record?: RaRecord;
    resource?: string;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement | false;
    warnWhenUnsavedChanges?: boolean;
}

export const findTabsWithErrors = (children, errors) => {
    console.warn(
        'Deprecated. FormTab now wrap their content inside a FormGroupContextProvider. If you implemented custom forms with tabs, please use the FormGroupContextProvider. See https://marmelab.com/react-admin/EditTutorial.html#grouping-inputs'
    );

    return Children.toArray(children).reduce((acc: any[], child) => {
        if (!isValidElement(child)) {
            return acc;
        }

        const inputs = Children.toArray(child.props.children);

        if (
            inputs.some(
                input =>
                    isValidElement(input) && get(errors, input.props.source)
            )
        ) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};
