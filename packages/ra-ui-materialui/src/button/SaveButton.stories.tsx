import * as React from 'react';
import { Form, ResourceContextProvider, TestMemoryRouter } from 'ra-core';
import { Paper } from '@mui/material';
import fakeRestDataProvider from 'ra-data-fakerest';
import { useFormContext } from 'react-hook-form';

import { SaveButton } from './SaveButton';
import { ArrayInput } from '../input/ArrayInput/ArrayInput';
import { TextInput } from '../input/TextInput';
import { SimpleFormIterator } from '../input/ArrayInput/SimpleFormIterator';
import { AdminContext } from '../AdminContext';
import { Edit } from '../detail';
import { Button } from './Button';

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
    const handleClick = () => {
        setValue('name', 'test', { shouldDirty: true });
    };
    return <Button label="Make change" onClick={handleClick} />;
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

export const ComplexForm = () => (
    <AdminContext
        dataProvider={fakeRestDataProvider(
            {
                posts: [
                    {
                        id: 1,
                        title: 'Lorem ipsum',
                        tags: [{ name: 'bazinga' }],
                    },
                ],
            },
            process.env.NODE_ENV !== 'test',
            300
        )}
    >
        <Paper>
            <ResourceContextProvider value="posts">
                <Edit id={1} redirect={false}>
                    <Form>
                        <TextInput source="title" />
                        <ArrayInput source="tags">
                            <SimpleFormIterator>
                                <TextInput source="name" />
                            </SimpleFormIterator>
                        </ArrayInput>
                        <SaveButton />
                        <FormInspector />
                    </Form>
                </Edit>
            </ResourceContextProvider>
        </Paper>
    </AdminContext>
);

const FormInspector = () => {
    const {
        formState: { isDirty, dirtyFields },
    } = useFormContext();
    return <p>{JSON.stringify({ isDirty, dirtyFields })}</p>;
};
