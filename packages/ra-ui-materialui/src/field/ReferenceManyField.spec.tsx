import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AdminContext } from '../AdminContext';
import { ReferenceManyField } from './ReferenceManyField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list/SingleFieldList';

const theme = createTheme();

describe('<ReferenceManyField />', () => {
    const defaultProps = {
        // resource and reference are the same because useReferenceManyFieldController
        // set the reference as the current resource
        resource: 'posts',
        reference: 'comments',
        page: 1,
        perPage: 10,
        target: 'post_id',
    };

    it('should render a list of the child component', async () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const history = createMemoryHistory();
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
                })}
                history={history}
            >
                <ThemeProvider theme={theme}>
                    <ReferenceManyField {...defaultProps}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyField>
                </ThemeProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/comments/1');
        expect(links[1].getAttribute('href')).toEqual('/comments/2');
    });

    it('should render nothing when there are no related records', async () => {
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () =>
                        Promise.resolve({ data: [], total: 0 }),
                })}
            >
                <ReferenceManyField {...defaultProps}>
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyField>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });
    });

    it('should support record with string identifier', async () => {
        const data = [
            { id: 'abc-1', title: 'hello' },
            { id: 'abc-2', title: 'world' },
        ];
        const history = createMemoryHistory();
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
                })}
                history={history}
            >
                <ReferenceManyField {...defaultProps}>
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyField>
            </AdminContext>
        );

        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/comments/abc-1');
        expect(links[1].getAttribute('href')).toEqual('/comments/abc-2');
    });

    it('should support record with number identifier', async () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const history = createMemoryHistory();
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
                })}
                history={history}
            >
                <ReferenceManyField {...defaultProps}>
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyField>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/comments/1');
        expect(links[1].getAttribute('href')).toEqual('/comments/2');
    });
});
