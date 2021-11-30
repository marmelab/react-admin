import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
    ReferenceManyField,
    ReferenceManyFieldView,
} from './ReferenceManyField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list/SingleFieldList';

const theme = createTheme();

describe('<ReferenceManyField />', () => {
    const defaultProps = {
        // resource and reference are the same because useReferenceManyFieldController
        // set the reference as the current resource
        resource: 'posts',
        reference: 'posts',
        page: 1,
        perPage: 10,
        setPage: () => null,
        setPerPage: () => null,
    };

    it('should render a list of the child component', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={theme}>
                    <ReferenceManyFieldView {...defaultProps} data={data}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyFieldView>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/posts/1');
        expect(links[1].getAttribute('href')).toEqual('/posts/2');
    });

    it('should render nothing when there are no related records', () => {
        render(
            <ThemeProvider theme={theme}>
                <ReferenceManyFieldView {...defaultProps} data={[]}>
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyFieldView>
            </ThemeProvider>
        );
        expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    it('should support record with string identifier', () => {
        const data = [
            { id: 'abc-1', title: 'hello' },
            { id: 'abc-2', title: 'world' },
        ];
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={theme}>
                    <ReferenceManyFieldView {...defaultProps} data={data}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyFieldView>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/posts/abc-1');
        expect(links[1].getAttribute('href')).toEqual('/posts/abc-2');
    });

    it('should support record with number identifier', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={theme}>
                    <ReferenceManyFieldView
                        {...defaultProps}
                        data={data}
                        ids={[1, 2]}
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyFieldView>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/posts/1');
        expect(links[1].getAttribute('href')).toEqual('/posts/2');
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
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                initialState={{
                    admin: { resources: { comments: { data: {} } } },
                }}
            >
                <ErrorBoundary onError={onError}>
                    <ThemeProvider theme={theme}>
                        <ReferenceManyField
                            record={{ id: 123 }}
                            resource="comments"
                            target="postId"
                            reference="posts"
                            basePath="/comments"
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </ThemeProvider>
                </ErrorBoundary>
                ,
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(onError.mock.calls[0][0].message).toBe(
                'You must declare a <Resource name="posts"> in order to use a <ReferenceManyField reference="posts">'
            );
        });
    });
});
