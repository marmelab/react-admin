import * as React from 'react';
import { required } from 'ra-core';
import { useFormContext } from 'react-hook-form';

import { TextInput } from './TextInput';
import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { Edit } from '../detail';
import { SimpleForm, TabbedForm, Toolbar } from '../form';
import { SaveButton } from '../button';
import { Datagrid, List } from '../list';
import { TextField } from '../field';

export default { title: 'ra-ui-materialui/input/InputErrors' };

const FormDebugToolbar = () => (
    <Toolbar>
        <SaveButton sx={{ mr: 1 }} label="Save" />
        <SaveButton alwaysEnable label="Save (always enabled)" />
    </Toolbar>
);

export const SimpleCreateOnSubmit = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm mode="onSubmit" toolbar={<FormDebugToolbar />}>
                <TextInput source="title" validate={required()} />
                <TextInput source="author" validate={required()} />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const SimpleCreateOnChange = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm mode="onChange" toolbar={<FormDebugToolbar />}>
                <TextInput source="title" validate={required()} />
                <TextInput source="author" validate={required()} />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const SimpleEditOnSubmit = () => (
    <AdminContext
        defaultTheme="light"
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 123,
                            title: 'Lorem ipsum',
                            author: 'John Doe',
                        },
                    }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit resource="posts" id={123} sx={{ width: 600 }}>
            <SimpleForm mode="onSubmit" toolbar={<FormDebugToolbar />}>
                <TextInput source="title" validate={required()} />
                <TextInput source="author" validate={required()} />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const SimpleEditOnChange = () => (
    <AdminContext
        defaultTheme="light"
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 123,
                            title: 'Lorem ipsum',
                            author: 'John Doe',
                        },
                    }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit resource="posts" id={123} sx={{ width: 600 }}>
            <SimpleForm mode="onChange" toolbar={<FormDebugToolbar />}>
                <TextInput source="title" validate={required()} />
                <TextInput source="author" validate={required()} />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

const postValidate = (values: any) => {
    const errors: any = {};
    if (!values.title) {
        errors.title = 'Title is required';
    }
    if (!values.author) {
        errors.author = 'Author is required';
    }
    return errors;
};

export const CreateGlobalValidationOnSubmit = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm
                mode="onSubmit"
                validate={postValidate}
                toolbar={<FormDebugToolbar />}
            >
                <TextInput source="title" isRequired />
                <TextInput source="author" isRequired />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const CreateGlobalValidationOnChange = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm
                mode="onChange"
                validate={postValidate}
                toolbar={<FormDebugToolbar />}
            >
                <TextInput source="title" isRequired />
                <TextInput source="author" isRequired />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const postValidateDependent = (values: any) => {
    const errors: any = {};
    if (!values.title && !values.author) {
        errors.author = 'Either a Title or an Author is required';
    }
    return errors;
};

export const CreateGlobalValidationDependentOnSubmit = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm
                mode="onSubmit"
                validate={postValidateDependent}
                toolbar={<FormDebugToolbar />}
            >
                <TextInput source="title" />
                <TextInput source="author" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const CreateGlobalValidationDependentOnChange = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm
                mode="onChange"
                validate={postValidateDependent}
                toolbar={<FormDebugToolbar />}
            >
                <TextInput source="title" />
                <TextInput source="author" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const InvalidEditOnSubmit = () => (
    <AdminContext
        defaultTheme="light"
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 123,
                            title: '',
                            author: '',
                        },
                    }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit resource="posts" id={123} sx={{ width: 600 }}>
            <SimpleForm mode="onSubmit" toolbar={<FormDebugToolbar />}>
                <TextInput source="title" validate={required()} />
                <TextInput source="author" validate={required()} />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const InvalidEditOnChange = () => (
    <AdminContext
        defaultTheme="light"
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 123,
                            title: '',
                            author: '',
                        },
                    }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit resource="posts" id={123} sx={{ width: 600 }}>
            <SimpleForm mode="onChange" toolbar={<FormDebugToolbar />}>
                <TextInput source="title" validate={required()} />
                <TextInput source="author" validate={required()} />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

const TriggerErrorButton = ({ source }: { source: string }) => {
    const { setError, clearErrors } = useFormContext();
    const onSetError = () => {
        setError(source, {
            type: 'manual',
            message: `${source} is invalid`,
        });
    };
    const onClearError = () => {
        clearErrors(source);
    };
    return (
        <>
            <button onClick={onSetError} type="button">
                Trigger {source} error
            </button>
            <button onClick={onClearError} type="button">
                Clear {source} error
            </button>
        </>
    );
};

export const ManualError = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm mode="onSubmit" toolbar={<FormDebugToolbar />}>
                <TriggerErrorButton source="title" />
                <TextInput source="title" />
                <TriggerErrorButton source="author" />
                <TextInput source="author" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const InTabbedForm = () => (
    <AdminContext
        defaultTheme="light"
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 123,
                            title: '',
                            author: '',
                        },
                    }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit resource="posts" id={123} sx={{ width: 600 }}>
            <TabbedForm toolbar={<FormDebugToolbar />}>
                <TabbedForm.Tab label="step-1">
                    <TextInput source="title" validate={required()} />
                </TabbedForm.Tab>
                <TabbedForm.Tab label="step-2">
                    <TextInput source="author" validate={required()} />
                </TabbedForm.Tab>
            </TabbedForm>
        </Edit>
    </AdminContext>
);

const postFilters = [
    <TextInput source="title" validate={required()} />,
    <TextInput source="author" validate={required()} />,
];

export const FilterForm = () => (
    <AdminContext
        defaultTheme="light"
        dataProvider={
            {
                getList: () =>
                    Promise.resolve({
                        data: [
                            {
                                id: 123,
                                title: 'Lorem ipsum',
                                author: 'John Doe',
                            },
                        ],
                        total: 1,
                    }),
            } as any
        }
    >
        <List resource="posts" sx={{ width: 600 }} filters={postFilters}>
            <Datagrid>
                <TextField source="title" />
                <TextField source="author" />
            </Datagrid>
        </List>
    </AdminContext>
);

export const HelperTextCustom = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm mode="onSubmit" toolbar={<FormDebugToolbar />}>
                <TextInput
                    source="title"
                    validate={required()}
                    helperText="Please fill in a title"
                />
                <TextInput
                    source="author"
                    validate={required()}
                    helperText="Please fill in an author"
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const HelperTextFalse = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm mode="onSubmit" toolbar={<FormDebugToolbar />}>
                <TextInput
                    source="title"
                    validate={required()}
                    helperText={false}
                />
                <TextInput
                    source="author"
                    validate={required()}
                    helperText={false}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);
