import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Form, useInput } from '../form';

export default {
    title: 'ra-core/core/SourceContext',
};

const TextInput = props => {
    const { field } = useInput(props);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor={field.name}>{props.label || field.name}</label>
            <input {...field} />
        </div>
    );
};

export const Basic = () => {
    return (
        <Form>
            <TextInput source="book" />
        </Form>
    );
};

export const WithoutSourceContext = () => {
    const form = useForm();
    return (
        <FormProvider {...form}>
            <form>
                <TextInput source="book" />
            </form>
        </FormProvider>
    );
};
