import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import {
    CoreAdminContext,
    EditBase,
    EditController,
    Form,
    InputProps,
    testDataProvider,
    TestMemoryRouter,
    useInput,
} from '../..';

export default {
    title: 'ra-core/controller/useEditController',
};

export const EncodedId = ({
    id = 'test?',
    url = '/posts/test%3F',
    dataProvider = testDataProvider({
        // @ts-expect-error
        getOne: () => Promise.resolve({ data: { id, title: 'hello' } }),
    }),
}) => {
    return (
        <TestMemoryRouter initialEntries={[url]}>
            <CoreAdminContext dataProvider={dataProvider}>
                <Routes>
                    <Route
                        path="/posts/:id"
                        element={
                            <EditController resource="posts">
                                {({ record }) => (
                                    <>
                                        <LocationInspector />
                                        <p>Id: {record && record.id}</p>
                                        <p>Title: {record && record.title}</p>
                                    </>
                                )}
                            </EditController>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const EncodedIdWithPercentage = ({
    id = 'test%',
    url = '/posts/test%25',
    dataProvider = testDataProvider({
        // @ts-expect-error
        getOne: () => Promise.resolve({ data: { id, title: 'hello' } }),
    }),
}) => {
    return (
        <TestMemoryRouter initialEntries={[url]}>
            <CoreAdminContext dataProvider={dataProvider}>
                <Routes>
                    <Route
                        path="/posts/:id"
                        element={
                            <EditController resource="posts">
                                {({ record }) => (
                                    <>
                                        <LocationInspector />
                                        <p>Id: {record && record.id}</p>
                                        <p>Title: {record && record.title}</p>
                                    </>
                                )}
                            </EditController>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const OverrideRecordWithLocation = ({
    url = '/posts/1',
    dataProvider = testDataProvider({
        // @ts-expect-error
        getOne: () =>
            Promise.resolve({
                data: { id: 1, title: 'hello', value: 'a value' },
            }),
    }),
}) => {
    return (
        <TestMemoryRouter key={url} initialEntries={[url]}>
            <CoreAdminContext dataProvider={dataProvider}>
                <Routes>
                    <Route
                        path="/posts/:id"
                        element={
                            <EditBase resource="posts">
                                <div
                                    style={{
                                        padding: '1rem',
                                    }}
                                >
                                    <LocationInspector deep />
                                    <Form>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem',
                                            }}
                                        >
                                            <TextInput source="title" />
                                            <TextInput source="value" />
                                        </div>
                                    </Form>
                                </div>
                            </EditBase>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

OverrideRecordWithLocation.argTypes = {
    url: {
        options: [
            'unmodified',
            'modified with location state',
            'modified with location search',
        ],
        mapping: {
            unmodified: '/posts/1',
            'modified with location state': {
                pathname: '/posts/1',
                state: { record: { value: 'from-state' } },
            },
            'modified with location search': `/posts/1?source=${encodeURIComponent(JSON.stringify({ value: 'from-search' }))}`,
        },
        control: { type: 'select' },
    },
};

const LocationInspector = ({ deep }: { deep?: boolean }) => {
    const location = useLocation();
    return (
        <p>
            Location:{' '}
            <code>{deep ? JSON.stringify(location) : location.pathname}</code>
        </p>
    );
};

const TextInput = (props: InputProps) => {
    const input = useInput(props);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <label htmlFor={input.id}>{props.source}</label>
            <input id={input.id} {...input.field} />
        </div>
    );
};
