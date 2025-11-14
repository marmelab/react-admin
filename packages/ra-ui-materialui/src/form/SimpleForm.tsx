import * as React from 'react';
import type { ReactNode } from 'react';
import { Form, type FormProps } from 'ra-core';
import {
    Stack,
    CardContent,
    type SxProps,
    type StackProps,
} from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';

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
 * @prop {ReactNode[]} children Input elements
 * @prop {Object} defaultValues
 * @prop {Function} validate
 * @prop {ReactNode} toolbar The element displayed at the bottom of the form, containing the SaveButton
 *
 * @param {Props} props
 */
export const SimpleForm = (inProps: SimpleFormProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
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
                <Stack
                    {...sanitizeRestProps(props)}
                    sx={{
                        alignItems: 'flex-start',
                    }}
                >
                    {children}
                </Stack>
            </Component>
            {toolbar}
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
    toolbar?: ReactNode;
    sx?: SxProps<Theme>;
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSimpleForm: 'root';
    }

    interface ComponentsPropsList {
        RaSimpleForm: Partial<SimpleFormProps>;
    }

    interface Components {
        RaSimpleForm?: {
            defaultProps?: ComponentsPropsList['RaSimpleForm'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSimpleForm'];
        };
    }
}
