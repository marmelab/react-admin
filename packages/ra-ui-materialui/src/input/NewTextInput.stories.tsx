import * as React from 'react';
import { required, FormGroupContextProvider, useFormGroup } from 'ra-core';
import { useFormState, useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';

import { NewTextInput } from './NewTextInput';
import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { Edit } from '../detail';
import { SimpleForm, Toolbar } from '../form';
import { SaveButton } from '../button';
import { FormInspector } from './common';
import { Datagrid, List } from '../list';
import { TextField } from '../field';

export default { title: 'ra-ui-materialui/input/NewTextInput' };

const Wrapper = ({ children }) => (
    <AdminContext defaultTheme="light">
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <NewTextInput source="title" />
        <FormInspector />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper>
        <NewTextInput source="title" defaultValue="hello" />
        <NewTextInput
            source="title1"
            label="Default john"
            defaultValue="john"
        />
        <NewTextInput
            source="title2"
            label="Default empty string"
            defaultValue=""
        />
        <NewTextInput source="title3" label="Default undefined" />
        <FormInspector name="title" />
        <FormInspector name="title1" />
        <FormInspector name="title2" />
        <FormInspector name="title3" />
    </Wrapper>
);

export const HelperText = () => (
    <Wrapper>
        <NewTextInput source="title" />
        <NewTextInput source="title" helperText={false} />
        <NewTextInput
            source="title"
            helperText="Number of times the post was read"
        />
    </Wrapper>
);

export const Label = () => (
    <Wrapper>
        <NewTextInput source="title" />
        <NewTextInput source="title" label={false} />
        <NewTextInput source="title" label="label of title" />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <NewTextInput source="title" label="default" />
        <NewTextInput
            source="title"
            label="Full Width False"
            fullWidth={false}
        />
    </Wrapper>
);

export const Margin = () => (
    <Wrapper>
        <NewTextInput source="title" label="default (dense)" />
        <NewTextInput source="title" label="none" margin="none" />
        <NewTextInput source="title" label="normal" margin="normal" />
    </Wrapper>
);

export const Variant = () => (
    <Wrapper>
        <NewTextInput source="title" label="default (filled)" />
        <NewTextInput source="title" label="outlined" variant="outlined" />
        <NewTextInput source="title" label="standard" variant="standard" />
    </Wrapper>
);

export const Required = () => (
    <AdminContext defaultTheme="light">
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm mode="onBlur">
                <NewTextInput source="title" />
                <NewTextInput source="title" required />
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="title" validate={[required()]} />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Error = () => (
    <AdminContext defaultTheme="light">
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm
                resolver={() => ({
                    values: {},
                    errors: {
                        title: {
                            type: 'custom',
                            message: 'Special error message',
                        },
                    },
                })}
            >
                <NewTextInput source="title" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Sx = () => (
    <Wrapper>
        <NewTextInput
            source="title"
            sx={{
                border: 'solid 1px red',
                borderRadius: '5px',
                '& .MuiInputLabel-root': { fontWeight: 'bold' },
            }}
        />
    </Wrapper>
);

export const ExtraProps = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>
                <NewTextInput
                    source="username"
                    inputProps={{ autocomplete: 'off' }}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const FormStateInspector = () => {
    const {
        touchedFields,
        isDirty,
        dirtyFields,
        isValid,
        errors,
    } = useFormState();
    return (
        <div>
            form state:&nbsp;
            <code style={{ backgroundColor: 'lightgrey' }}>
                {JSON.stringify({
                    touchedFields,
                    isDirty,
                    dirtyFields,
                    isValid,
                    errors,
                })}
            </code>
        </div>
    );
};

const FieldStateInspector = ({ name = 'title' }) => {
    const formContext = useFormContext();
    return (
        <div>
            {name}:
            <code style={{ backgroundColor: 'lightgrey' }}>
                {JSON.stringify(
                    formContext.getFieldState(name, formContext.formState)
                )}
            </code>
        </div>
    );
};

export const FieldState = () => (
    <Wrapper>
        <NewTextInput source="title" />
        <FormStateInspector />
        <FieldStateInspector />
    </Wrapper>
);

const AlwaysOnToolbar = (
    <Toolbar>
        <SaveButton alwaysEnable />
    </Toolbar>
);

export const ValueUndefined = ({ onSuccess = console.log }) => (
    <AdminContext
        dataProvider={
            {
                getOne: () => Promise.resolve({ data: { id: 123 } }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
        defaultTheme="light"
    >
        <Edit
            resource="posts"
            id="123"
            sx={{ width: 600 }}
            mutationOptions={{ onSuccess }}
        >
            <SimpleForm toolbar={AlwaysOnToolbar}>
                <NewTextInput source="title" />
                <FormInspector />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const ValueNull = ({ onSuccess = console.log }) => (
    <AdminContext
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: null } }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
        defaultTheme="light"
    >
        <Edit
            resource="posts"
            id="123"
            sx={{ width: 600 }}
            mutationOptions={{ onSuccess }}
        >
            <SimpleForm toolbar={AlwaysOnToolbar}>
                <NewTextInput source="title" />
                <FormInspector />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Parse = ({ onSuccess = console.log }) => (
    <AdminContext defaultTheme="light">
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
            mutationOptions={{ onSuccess }}
        >
            <SimpleForm>
                <NewTextInput
                    source="title"
                    parse={v => (v === 'foo' ? 'bar' : v)}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

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
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="author" validate={required()} />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const SimpleCreateOnChange = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm mode="onChange" toolbar={<FormDebugToolbar />}>
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="author" validate={required()} />
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
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="author" validate={required()} />
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
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="author" validate={required()} />
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
                <NewTextInput source="title" isRequired />
                <NewTextInput source="author" isRequired />
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
                <NewTextInput source="title" isRequired />
                <NewTextInput source="author" isRequired />
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
                <NewTextInput source="title" />
                <NewTextInput source="author" />
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
                <NewTextInput source="title" />
                <NewTextInput source="author" />
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
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="author" validate={required()} />
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
                <NewTextInput source="title" validate={required()} />
                <NewTextInput source="author" validate={required()} />
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
                <NewTextInput source="title" />
                <TriggerErrorButton source="author" />
                <NewTextInput source="author" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const WizardToolbar = ({ step, goNext, goPrev }: any) => {
    const step1State = useFormGroup('step-1');
    const step2State = useFormGroup('step-2');

    const { trigger } = useFormContext();
    // Trigger form validation initially, and on step change, to force the FormGroup-level
    // isValid flag to be in sync
    React.useEffect(() => {
        trigger();
    }, [step, trigger]);

    return (
        <Toolbar>
            {step === 1 ? (
                <Button
                    onClick={goNext}
                    type="submit"
                    disabled={!step1State.isValid}
                >
                    Next
                </Button>
            ) : (
                <>
                    <Button onClick={goPrev} type="button">
                        Prev
                    </Button>
                    <SaveButton
                        label="Save (default)"
                        size="small"
                        sx={{ ml: 1 }}
                    />
                    <SaveButton
                        disabled={!step2State.isValid}
                        label="Save (step 2 state)"
                        size="small"
                        sx={{ ml: 1 }}
                    />
                    <SaveButton
                        alwaysEnable
                        label="Save (always enabled)"
                        size="small"
                        sx={{ ml: 1 }}
                    />
                </>
            )}
        </Toolbar>
    );
};

export const WizardForm = () => {
    const [step, setStep] = React.useState(1);
    const goNext = (event: any) => {
        event.preventDefault();
        setStep(step + 1);
    };
    const goPrev = () => {
        setStep(step - 1);
    };

    return (
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
                <SimpleForm
                    mode="onChange"
                    toolbar={
                        <WizardToolbar
                            step={step}
                            goNext={goNext}
                            goPrev={goPrev}
                        />
                    }
                >
                    <FormGroupContextProvider name="step-1">
                        {step === 1 ? (
                            <NewTextInput
                                source="title"
                                validate={required()}
                            />
                        ) : null}
                    </FormGroupContextProvider>
                    <FormGroupContextProvider name="step-2">
                        {step === 2 ? (
                            <NewTextInput
                                source="author"
                                validate={required()}
                            />
                        ) : null}
                    </FormGroupContextProvider>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

const postFilters = [
    <NewTextInput source="title" validate={required()} />,
    <NewTextInput source="author" validate={required()} />,
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
