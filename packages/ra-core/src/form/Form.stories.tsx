import * as React from 'react';
import { useFormState } from 'react-hook-form';

import { CoreAdminContext } from '../core';
import { Form } from './Form';
import { useInput } from './useInput';

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
            <p>{fieldState.error?.message}</p>
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

export const SanitizeEmptyValues = () => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    return (
        <CoreAdminContext>
            <Form
                onSubmit={data => setSubmittedData(data)}
                record={{ id: 1, field1: 'bar', field6: null }}
                sanitizeEmptyValues
            >
                <Input source="field1" />
                <Input source="field2" defaultValue="bar" />
                <Input source="field3" defaultValue="" />
                <Input source="field4" />
                <Input source="field5" parse={v => v || undefined} />
                <Input source="field6" />

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
