import * as React from 'react';
import { Form, TestMemoryRouter } from 'ra-core';
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
    <TestMemoryRouter>
        <AdminContext>
            <Paper>
                <Form>
                    <MakeFormChange />
                    <SaveButton />
                </Form>
            </Paper>
        </AdminContext>
    </TestMemoryRouter>
);

export const EnabledWhenFormIsPrefilled = () => (
    <TestMemoryRouter
        initialEntries={[
            `/posts/create?source=${JSON.stringify({ title: 'foo' })}`,
        ]}
    >
        <AdminContext>
            <Paper>
                <Form>
                    <SaveButton />
                </Form>
            </Paper>
        </AdminContext>
    </TestMemoryRouter>
);

export const AlwaysEnable = () => (
    <TestMemoryRouter>
        <AdminContext>
            <Paper>
                <Form>
                    <SaveButton alwaysEnable />
                </Form>
            </Paper>
        </AdminContext>
    </TestMemoryRouter>
);

export const Submitting = () => (
    <TestMemoryRouter>
        <AdminContext>
            <Paper>
                <Form onSubmit={() => new Promise(() => {})}>
                    <MakeFormChange />
                    <SaveButton />
                </Form>
            </Paper>
        </AdminContext>
    </TestMemoryRouter>
);
