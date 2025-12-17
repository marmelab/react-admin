import * as React from 'react';
import { CoreAdminContext } from '../core';
import { Form } from './Form';
import { InputProps, useInput } from './useInput';

export default {
    title: 'ra-core/form/useInput',
};

const Input = (props: InputProps & { log?: boolean }) => {
    const { label, log } = props;
    const { id, field, fieldState } = useInput(props);
    if (log) {
        console.log(`Input ${id} rendered:`);
    }
    return (
        <label htmlFor={id}>
            {label ?? id}: <input id={id} {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
        </label>
    );
};

export const Basic = () => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    return (
        <CoreAdminContext>
            <Form onSubmit={data => setSubmittedData(data)}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em',
                        marginBottom: '1em',
                    }}
                >
                    <Input source="field1" />
                    <Input source="field2" />
                    <Input source="field3" />
                </div>
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </CoreAdminContext>
    );
};

export const DefaultValue = ({
    initialValue,
}: {
    initialValue: string | null | undefined;
}) => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    return (
        <CoreAdminContext>
            <Form
                record={{ field1: initialValue }}
                onSubmit={data => setSubmittedData(data)}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em',
                        marginBottom: '1em',
                    }}
                >
                    <Input source="field1" defaultValue="default value" />
                </div>
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </CoreAdminContext>
    );
};

DefaultValue.args = {
    initialValue: 'valid',
};

DefaultValue.argTypes = {
    initialValue: {
        options: ['valid', 'null', 'undefined'],
        mapping: {
            valid: 'initial value',
            null: null,
            undefined: undefined,
        },
        control: { type: 'select' },
    },
};

export const Large = () => {
    const [submittedData, setSubmittedData] = React.useState<any>();
    const fields = Array.from({ length: 15 }).map((_, index) => (
        <Input
            key={index}
            source={`field${index + 1}`}
            label={`field${index + 1}`}
        />
    ));
    return (
        <CoreAdminContext>
            <Form
                onSubmit={data => setSubmittedData(data)}
                record={Array.from({ length: 15 }).reduce((acc, _, index) => {
                    acc[`field${index + 1}`] = `value${index + 1}`;
                    return acc;
                }, {})}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em',
                        marginBottom: '1em',
                    }}
                >
                    {fields}
                </div>
                <button type="submit">Submit</button>
            </Form>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </CoreAdminContext>
    );
};
