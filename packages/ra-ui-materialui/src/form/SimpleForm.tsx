import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { Form, FormProps } from 'ra-core';
import { Stack, CardContent, SxProps, StackProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Toolbar } from './Toolbar';

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
 * export const PostCreate = () => (
 *     <Create>
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
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 *
 * @param {Props} props
 */
export const SimpleForm = (props: SimpleFormProps) => {
    const {
        children,
        className,
        component: Component = DefaultComponent,
        sx,
        toolbar = DefaultToolbar,
        ...rest
    } = props;
    return (
        <Form {...rest}>
            <Component className={className} sx={sx}>
                <Stack alignItems="flex-start" {...sanitizeRestProps(props)}>
                    {children}
                </Stack>
            </Component>
            {toolbar !== false ? toolbar : null}
        </Form>
    );
};

export interface SimpleFormProps
    extends Omit<FormProps, 'render'>,
        Omit<StackProps, 'onSubmit'> {
    children: ReactNode;
    className?: string;
    component?: React.ComponentType<any>;
    defaultValues?: any;
    toolbar?: ReactElement | false;
    sx?: SxProps;
}

const PREFIX = 'RaSimpleForm';

const DefaultComponent = styled(CardContent, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        paddingBottom: '5em',
    },
}));

const DefaultToolbar = <Toolbar />;

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    children,
    className,
    component,
    criteriaMode,
    defaultValues,
    delayError,
    onSubmit,
    record,
    resource,
    reValidateMode,
    sx,
    toolbar,
    validate,
    resetOptions,
    resolver,
    sanitizeEmptyValues,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    warnWhenUnsavedChanges,
    ...props
}: SimpleFormProps) => props;
/* eslint-enable @typescript-eslint/no-unused-vars */
