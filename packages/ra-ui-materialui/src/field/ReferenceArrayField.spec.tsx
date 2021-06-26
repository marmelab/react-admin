import * as React from 'react';
import expect from 'expect';
import { render, act, waitFor } from '@testing-library/react';
import { renderWithRedux } from 'ra-test';
import { MemoryRouter } from 'react-router-dom';
import { ListContextProvider, DataProviderContext } from 'ra-core';

import ReferenceArrayField, {
    ReferenceArrayFieldView,
} from './ReferenceArrayField';
import TextField from './TextField';
import SingleFieldList from '../list/SingleFieldList';

describe('<ReferenceArrayField />', () => {
    it('should render a loading indicator when related records are not yet fetched and a second has passed', async () => {
        const { queryAllByRole } = render(
            <ListContextProvider
                value={{
                    resource: 'foo',
                    basePath: '',
                    data: null,
                    ids: [1, 2],
                    loaded: false,
                    loading: true,
                }}
            >
                <ReferenceArrayFieldView
                    source="barIds"
                    reference="bar"
                    record={{ id: 123, barIds: [1, 2] }}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayFieldView>
            </ListContextProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));
        expect(queryAllByRole('progressbar')).toHaveLength(1);
    });

    it('should render a list of the child component', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: [1, 2],
                        loaded: true,
                        loading: false,
                    }}
                >
                    <ReferenceArrayFieldView
                        source="barIds"
                        record={{ id: 123, barIds: [1, 2] }}
                        reference="bar"
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should render nothing when there are no related records', () => {
        const { queryAllByRole, container } = render(
            <ListContextProvider
                value={{
                    resource: 'foo',
                    basePath: '',
                    data: {},
                    ids: [],
                    loaded: true,
                    loading: false,
                }}
            >
                <ReferenceArrayFieldView
                    source="barIds"
                    record={{ id: 123, barIds: [1, 2] }}
                    reference="bar"
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayFieldView>
            </ListContextProvider>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).toBe('');
    });

    it('should support record with string identifier', () => {
        const data = {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: ['abc-1', 'abc-2'],
                        loaded: true,
                        loading: false,
                    }}
                >
                    <ReferenceArrayFieldView
                        record={{ id: 123, barIds: ['abc-1', 'abc-2'] }}
                        reference="bar"
                        source="barIds"
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should support record with number identifier', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: [1, 2],
                        loaded: true,
                        loading: false,
                    }}
                >
                    <ReferenceArrayFieldView
                        record={{ id: 123, barIds: [1, 2] }}
                        resource="foo"
                        reference="bar"
                        source="barIds"
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should use custom className', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { container } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: [1, 2],
                        loaded: true,
                        loading: false,
                    }}
                >
                    <ReferenceArrayFieldView
                        record={{ id: 123, barIds: [1, 2] }}
                        className="myClass"
                        resource="foo"
                        reference="bar"
                        source="barIds"
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('myClass')).toHaveLength(1);
    });

    it('should have defined data when loaded', async () => {
        let resolve;
        const promise = new Promise<any>(res => {
            resolve = res;
        });
        const WeakField = ({ record }: any) => <div>{record.title}</div>;
        const dataProvider = {
            getMany: () =>
                promise.then(() => ({
                    data: [
                        { id: 1, title: 'bar1' },
                        { id: 2, title: 'bar2' },
                    ],
                })),
        };
        const { queryByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceArrayField
                    record={{ id: 123, barIds: [1, 2] }}
                    className="myClass"
                    resource="foos"
                    reference="bars"
                    source="barIds"
                    basePath="/foos"
                >
                    <SingleFieldList linkType={false}>
                        <WeakField />
                    </SingleFieldList>
                </ReferenceArrayField>
            </DataProviderContext.Provider>,
            { admin: { resources: { bars: { data: {} } } } }
        );
        expect(queryByText('bar1')).toBeNull();
        act(() => resolve());
        await waitFor(() => {
            expect(queryByText('bar1')).not.toBeNull();
        });
    });

    it('should throw an error if used without a Resource for the reference', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        class ErrorBoundary extends React.Component<
            {
                onError?: (
                    error: Error,
                    info: { componentStack: string }
                ) => void;
            },
            { error: Error | null }
        > {
            constructor(props) {
                super(props);
                this.state = { error: null };
            }

            static getDerivedStateFromError(error) {
                // Update state so the next render will show the fallback UI.
                return { error };
            }

            componentDidCatch(error, errorInfo) {
                // You can also log the error to an error reporting service
                this.props.onError(error, errorInfo);
            }

            render() {
                if (this.state.error) {
                    // You can render any custom fallback UI
                    return <h1>Something went wrong.</h1>;
                }

                return this.props.children;
            }
        }
        const onError = jest.fn();
        renderWithRedux(
            <ErrorBoundary onError={onError}>
                <ReferenceArrayField
                    record={{ id: 123, barIds: [1, 2] }}
                    className="myClass"
                    resource="foos"
                    reference="bars"
                    source="barIds"
                    basePath="/foos"
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayField>
            </ErrorBoundary>,
            { admin: { resources: { comments: { data: {} } } } }
        );
        await waitFor(() => {
            expect(onError.mock.calls[0][0].message).toBe(
                'You must declare a <Resource name="bars"> in order to use a <ReferenceArrayField reference="bars">'
            );
        });
    });
});
