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

import { CoreAdminContext } from '../core';
import { Form } from './Form';
import { useInput } from './useInput';
import { required } from './validate';
import ValidationError from './ValidationError';
import { mergeTranslations } from '../i18n';
import { I18nProvider } from '../types';

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
    const state = useFormState();

    return (
        <button type="submit" disabled={!state.isDirty}>
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
        app: { validation: { required: 'This field must be provided' } },
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
