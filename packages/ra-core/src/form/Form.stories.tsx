import * as React from 'react';
import {
    useController,
    UseControllerProps,
    useFormState,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import {
    Route,
    Routes,
    useNavigate,
    Link,
    HashRouter,
    useLocation,
} from 'react-router-dom';

import { CoreAdminContext } from '../core';
import { RecordContextProvider, SaveContextProvider } from '../controller';
import { Form, FormProps } from './Form';
import { useInput } from './useInput';
import { required, ValidationError } from './validation';
import { mergeTranslations } from '../i18n';
import { I18nProvider, RaRecord } from '../types';
import { TestMemoryRouter } from '../routing';
import { useNotificationContext } from '../notification';

export default {
    title: 'ra-core/form/Form',
};

const Input = props => {
    const { field, fieldState } = useInput(props);
    return (
        <div
            style={{
                display: 'flex',
                gap: '1em',
                margin: '1em',
                alignItems: 'center',
            }}
        >
            <label htmlFor={field.name}>{field.name}</label>
            <input
                aria-label={field.name}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                {...field}
            />
            {fieldState.error && fieldState.error.message ? (
                <ValidationError error={fieldState.error.message} />
            ) : null}
        </div>
    );
};

const SubmitButton = () => {
    const { dirtyFields } = useFormState();
    // useFormState().isDirty might differ from useFormState().dirtyFields (https://github.com/react-hook-form/react-hook-form/issues/4740)
    const isDirty = Object.keys(dirtyFields).length > 0;

    return (
        <button type="submit" disabled={!isDirty}>
            Submit
        </button>
    );
};

export const Basic = () => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    return (
        <CoreAdminContext>
            <Form
                onSubmit={data => setSubmittedData(data)}
                record={{ id: 1, field1: 'bar', field6: null }}
            >
                <Input source="field1" />
                <Input source="field2" defaultValue="bar" />
                <Input source="field3" defaultValue="" />
                <Input source="field4" />
                <Input source="field5" parse={v => v || undefined} />
                <Input source="field6" />
                <SubmitButton />
            </Form>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </CoreAdminContext>
    );
};

const CustomInput = (props: UseControllerProps) => {
    const { field, fieldState } = useController(props);
    return (
        <div
            style={{
                display: 'flex',
                gap: '1em',
                margin: '1em',
                alignItems: 'center',
            }}
        >
            <label htmlFor={field.name}>{field.name}</label>
            <input
                aria-label={field.name}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                {...field}
                value={field.value ?? ''}
            />
            <p>{fieldState.error?.message}</p>
        </div>
    );
};

export const SanitizeEmptyValues = () => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    const field11 = { name: 'field11' };
    const field12 = {
        name: 'field12',
        defaultValue: 'bar',
    };
    const field13 = {
        name: 'field13',
        defaultValue: '',
    };
    const field14 = { name: 'field14' };
    const field16 = { name: 'field16' };
    return (
        <CoreAdminContext>
            <Form
                onSubmit={data => setSubmittedData(data)}
                record={{
                    id: 1,
                    field1: 'bar',
                    field6: null,
                    field11: 'bar',
                    field16: null,
                }}
                sanitizeEmptyValues
            >
                <Input source="field1" />
                <Input source="field2" defaultValue="bar" />
                <Input source="field3" defaultValue="" />
                <Input source="field4" />
                <Input source="field5" parse={v => v || undefined} />
                <Input source="field6" />
                <CustomInput {...field11} />
                <CustomInput {...field12} />
                <CustomInput {...field13} />
                <CustomInput {...field14} />
                <CustomInput {...field16} />

                <SubmitButton />
            </Form>
            <pre data-testid="result">
                {JSON.stringify(submittedData, null, 2)}
            </pre>
        </CoreAdminContext>
    );
};

export const NullValue = () => {
    const [result, setResult] = React.useState<any>();
    return (
        <CoreAdminContext>
            <Form record={{ foo: null }} onSubmit={data => setResult(data)}>
                <Input source="foo" />
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </CoreAdminContext>
    );
};

export const UndefinedValue = () => {
    const [result, setResult] = React.useState<any>();
    return (
        <CoreAdminContext>
            <Form record={{}} onSubmit={data => setResult(data)}>
                <Input source="foo" />
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </CoreAdminContext>
    );
};

const defaultI18nProvider = polyglotI18nProvider(() =>
    mergeTranslations(englishMessages, {
        app: {
            validation: {
                required: 'This field must be provided',
            },
        },
    })
);

export const FormLevelValidation = ({
    i18nProvider = defaultI18nProvider,
}: {
    i18nProvider?: I18nProvider;
}) => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    return (
        <CoreAdminContext i18nProvider={i18nProvider}>
            <Form
                onSubmit={data => setSubmittedData(data)}
                record={{ id: 1, field1: 'bar', field6: null }}
                validate={(values: any) => {
                    const errors: any = {};
                    if (!values.defaultMessage) {
                        errors.defaultMessage = 'ra.validation.required';
                    }
                    if (!values.customMessage) {
                        errors.customMessage = 'This field is required';
                    }
                    if (!values.customMessageTranslationKey) {
                        errors.customMessageTranslationKey =
                            'app.validation.required';
                    }
                    if (!values.missingCustomMessageTranslationKey) {
                        errors.missingCustomMessageTranslationKey =
                            'app.validation.missing';
                    }
                    return errors;
                }}
            >
                <Input source="defaultMessage" />
                <Input source="customMessage" />
                <Input source="customMessageTranslationKey" />
                <Input source="missingCustomMessageTranslationKey" />
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </CoreAdminContext>
    );
};

export const InputLevelValidation = ({
    i18nProvider = defaultI18nProvider,
}: {
    i18nProvider?: I18nProvider;
}) => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    return (
        <CoreAdminContext i18nProvider={i18nProvider}>
            <Form
                onSubmit={data => setSubmittedData(data)}
                record={{ id: 1, field1: 'bar', field6: null }}
            >
                <Input source="defaultMessage" validate={required()} />
                <Input
                    source="customMessage"
                    validate={required('This field is required')}
                />
                <Input
                    source="customMessageTranslationKey"
                    validate={required('app.validation.required')}
                />
                <Input
                    source="missingCustomMessageTranslationKey"
                    validate={required('app.validation.missing')}
                />
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </CoreAdminContext>
    );
};

const zodSchema = z.object({
    defaultMessage: z.string(), //.min(1),
    customMessage: z.string({
        required_error: 'This field is required',
    }),
    customMessageTranslationKey: z.string({
        required_error: 'app.validation.required',
    }),
    missingCustomMessageTranslationKey: z.string({
        required_error: 'app.validation.missing',
    }),
});

export const ZodResolver = ({
    i18nProvider = defaultI18nProvider,
}: {
    i18nProvider?: I18nProvider;
}) => {
    const [result, setResult] = React.useState<any>();
    return (
        <CoreAdminContext i18nProvider={i18nProvider}>
            <Form
                record={{}}
                onSubmit={data => setResult(data)}
                resolver={zodResolver(zodSchema)}
            >
                <Input source="defaultMessage" />
                <Input source="customMessage" />
                <Input source="customMessageTranslationKey" />
                <Input source="missingCustomMessageTranslationKey" />
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </CoreAdminContext>
    );
};

const FormUnderTest = () => {
    const navigate = useNavigate();
    return (
        <>
            <Form
                record={{ title: 'lorem', body: 'ipsum' }}
                onSubmit={() => setTimeout(() => navigate('/'), 0)}
                warnWhenUnsavedChanges
            >
                <Input source="title" />
                <Input source="body" />
                <button type="submit">Submit</button>
            </Form>
            <Link to="/">Leave the form</Link>
        </>
    );
};

export const WarnWhenUnsavedChanges = ({
    i18nProvider = defaultI18nProvider,
}: {
    i18nProvider?: I18nProvider;
}) => (
    <CoreAdminContext i18nProvider={i18nProvider}>
        <Routes>
            <Route path="/" element={<Link to="/form">Go to form</Link>} />
            <Route path="/form" element={<FormUnderTest />} />
        </Routes>
    </CoreAdminContext>
);

export const InNonDataRouter = ({
    i18nProvider = defaultI18nProvider,
}: {
    i18nProvider?: I18nProvider;
}) => (
    <HashRouter
        future={{ v7_relativeSplatPath: false, v7_startTransition: false }}
    >
        <CoreAdminContext i18nProvider={i18nProvider}>
            <Routes>
                <Route path="/" element={<Link to="/form">Go to form</Link>} />
                <Route path="/form" element={<FormUnderTest />} />
            </Routes>
        </CoreAdminContext>
    </HashRouter>
);

const Notifications = () => {
    const { notifications } = useNotificationContext();
    return (
        <ul>
            {notifications.map(({ message }, id) => (
                <li key={id}>{message}</li>
            ))}
        </ul>
    );
};

export const ServerSideValidation = () => {
    const save = React.useCallback(values => {
        const errors: any = {};
        if (!values.defaultMessage) {
            errors.defaultMessage = 'ra.validation.required';
        }
        if (!values.customMessage) {
            errors.customMessage = 'This field is required';
        }
        if (!values.customMessageTranslationKey) {
            errors.customMessageTranslationKey = 'app.validation.required';
        }
        if (!values.missingCustomMessageTranslationKey) {
            errors.missingCustomMessageTranslationKey =
                'app.validation.missing';
        }
        if (!values.customGlobalMessage) {
            errors.customGlobalMessage = 'ra.validation.required';
            errors.root = {
                serverError: 'There are validation errors. Please fix them.',
            };
        }
        return Object.keys(errors).length > 0 ? errors : undefined;
    }, []);
    return (
        <CoreAdminContext i18nProvider={defaultI18nProvider}>
            <SaveContextProvider value={{ save }}>
                <Form
                    record={{
                        id: 1,
                        defaultMessage: 'foo',
                        customMessage: 'foo',
                        customMessageTranslationKey: 'foo',
                        missingCustomMessageTranslationKey: 'foo',
                        customGlobalMessage: 'foo',
                    }}
                >
                    <Input source="defaultMessage" />
                    <Input source="customMessage" />
                    <Input source="customMessageTranslationKey" />
                    <Input source="missingCustomMessageTranslationKey" />
                    <Input source="customGlobalMessage" />
                    <button type="submit">Submit</button>
                </Form>
                <Notifications />
            </SaveContextProvider>
        </CoreAdminContext>
    );
};

export const MultiRoutesForm = ({
    url,
    initialRecord,
    defaultValues,
}: {
    url?: any;
    initialRecord?: Partial<RaRecord>;
    defaultValues?: Partial<RaRecord>;
}) => (
    <TestMemoryRouter key={url} initialEntries={[url]}>
        <CoreAdminContext i18nProvider={defaultI18nProvider}>
            <Routes>
                <Route
                    path="/form/*"
                    element={
                        <RecordContextProvider value={initialRecord}>
                            <FormWithSubRoutes defaultValues={defaultValues} />
                        </RecordContextProvider>
                    }
                />
            </Routes>
        </CoreAdminContext>
    </TestMemoryRouter>
);

MultiRoutesForm.args = {
    url: 'unmodified',
    initialRecord: 'none',
};

MultiRoutesForm.argTypes = {
    url: {
        options: [
            'unmodified',
            'modified with location state',
            'modified with location search',
        ],
        mapping: {
            unmodified: '/form/general',
            'modified with location state': {
                pathname: '/form/general',
                state: { record: { body: 'from-state' } },
            },
            'modified with location search': `/form/general?source=${encodeURIComponent(JSON.stringify({ body: 'from-search' }))}`,
        },
        control: { type: 'select' },
    },
    defaultValues: {
        options: ['none', 'provided'],
        mapping: {
            none: undefined,
            provided: {
                category: 'default category',
            },
        },
        control: { type: 'select' },
    },
    initialRecord: {
        options: ['none', 'provided'],
        mapping: {
            none: undefined,
            provided: { title: 'lorem', body: 'unmodified' },
        },
        control: { type: 'select' },
    },
};

const FormWithSubRoutes = (props: Partial<FormProps>) => {
    return (
        <Form {...props}>
            <TabbedForm />
            <SubmitButton />
        </Form>
    );
};

const TabbedForm = () => {
    const location = useLocation();

    return (
        <>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link
                    to={{
                        ...location,
                        pathname: 'general',
                    }}
                >
                    General
                </Link>
                <Link
                    to={{
                        ...location,
                        pathname: 'content',
                    }}
                >
                    Settings
                </Link>
            </div>
            <Tab name="general">
                <Input source="title" />
                <Input source="category" />
            </Tab>
            <Tab name="content">
                <Input source="body" />
            </Tab>
        </>
    );
};
const Tab = ({
    children,
    name,
}: {
    children: React.ReactNode;
    name: string;
}) => {
    const location = useLocation();

    return (
        <div
            style={{
                display: location.pathname.endsWith(`/${name}`)
                    ? 'flex'
                    : 'none',
            }}
        >
            {children}
        </div>
    );
};
