import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ReferenceManyFieldView } from './ReferenceManyField';
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
});
