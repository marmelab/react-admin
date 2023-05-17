import * as React from 'react';
import { Form, testDataProvider } from 'ra-core';

import { SaveButton } from './SaveButton';
import { SimpleForm, Toolbar } from '../form';
import { Edit } from '../detail';
import {
    TextInput,
    ArrayInput,
    SimpleFormIterator,
    NumberInput,
} from '../input';
import { AdminContext } from '../AdminContext';
import { useFormContext } from 'react-hook-form';

export default {
    title: 'ra-ui-materialui/button/SaveButton',
};

export const Basic = () => (
    <AdminContext>
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
    <AdminContext>
        <Form>
            <MakeFormChange />
            <SaveButton />
        </Form>
    </AdminContext>
);

export const AlwaysEnable = () => (
    <AdminContext>
        <Form>
            <SaveButton alwaysEnable />
        </Form>
    </AdminContext>
);

export const Submitting = () => (
    <AdminContext>
        <Form onSubmit={() => new Promise(() => {})}>
            <MakeFormChange />
            <SaveButton />
        </Form>
    </AdminContext>
);
