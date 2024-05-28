import * as React from 'react';
import { Form } from 'ra-core';

import { SaveButton } from './SaveButton';
import { AdminContext } from '../AdminContext';
import { useFormContext } from 'react-hook-form';

export default {
    title: 'ra-ui-materialui/button/SaveButton',
};

export const Basic = () => (
    <AdminContext defaultTheme="light">
        <Form>
            <SaveButton />
        </Form>
    </AdminContext>
);

const MakeFormChange = () => {
    const { setValue } = useFormContext();
    React.useEffect(() => {
        setValue('name', 'test', { shouldDirty: true });
    }, [setValue]);
    return null;
};

export const Dirty = () => (
    <AdminContext defaultTheme="light">
        <Form>
            <MakeFormChange />
            <SaveButton />
        </Form>
    </AdminContext>
);

export const AlwaysEnable = () => (
    <AdminContext defaultTheme="light">
        <Form>
            <SaveButton alwaysEnable />
        </Form>
    </AdminContext>
);

export const Submitting = () => (
    <AdminContext defaultTheme="light">
        <Form onSubmit={() => new Promise(() => {})}>
            <MakeFormChange />
            <SaveButton />
        </Form>
    </AdminContext>
);
