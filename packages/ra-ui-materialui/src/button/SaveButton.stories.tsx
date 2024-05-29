import * as React from 'react';
import { Form } from 'ra-core';
import { Paper } from '@mui/material';

import { SaveButton } from './SaveButton';
import { AdminContext } from '../AdminContext';
import { useFormContext } from 'react-hook-form';

export default {
    title: 'ra-ui-materialui/button/SaveButton',
};

export const Basic = () => (
    <AdminContext>
        <Paper>
            <Form>
                <SaveButton />
            </Form>
        </Paper>
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
        <Paper>
            <Form>
                <MakeFormChange />
                <SaveButton />
            </Form>
        </Paper>
    </AdminContext>
);

export const AlwaysEnable = () => (
    <AdminContext>
        <Paper>
            <Form>
                <SaveButton alwaysEnable />
            </Form>
        </Paper>
    </AdminContext>
);

export const Submitting = () => (
    <AdminContext>
        <Paper>
            <Form onSubmit={() => new Promise(() => {})}>
                <MakeFormChange />
                <SaveButton />
            </Form>
        </Paper>
    </AdminContext>
);
