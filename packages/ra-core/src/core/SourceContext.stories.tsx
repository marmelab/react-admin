import * as React from 'react';
import { TextInput } from 'ra-ui-materialui';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '../form';

export default {
    title: 'ra-core/core/SourceContext',
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
