import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ReferenceManyFieldView } from './ReferenceManyField';
import TextField from './TextField';
import SingleFieldList from '../list/SingleFieldList';

describe('<ReferenceManyField />', () => {
    afterEach(cleanup);
    const defaultProps = {
        resource: 'foo',
        reference: 'bar',
        basePath: 'posts',
        page: 1,
        perPage: 10,
        setPage: () => null,
        setPerPage: () => null,
    };

    it('should render a list of the child component', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const history = createMemoryHistory();
        const { queryAllByRole } = render(
            <Router history={history}>
                <ReferenceManyFieldView
                    {...defaultProps}
                    data={data}
                    ids={[1, 2]}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyFieldView>
            </Router>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        const links = queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/posts/1');
        expect(links[1].getAttribute('href')).toEqual('/posts/2');
    });

    it('should render nothing when there are no related records', () => {
        const { queryAllByRole } = render(
            <ReferenceManyFieldView {...defaultProps} data={{}} ids={[]}>
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyFieldView>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(queryAllByRole('link')).toHaveLength(0);
    });

    it('should support record with string identifier', () => {
        const data = {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        };
        const history = createMemoryHistory();
        const { queryAllByRole } = render(
            <Router history={history}>
                <ReferenceManyFieldView
                    {...defaultProps}
                    data={data}
                    ids={['abc-1', 'abc-2']}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyFieldView>
            </Router>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        const links = queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/posts/abc-1');
        expect(links[1].getAttribute('href')).toEqual('/posts/abc-2');
    });

    it('should support record with number identifier', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const history = createMemoryHistory();
        const { queryAllByRole } = render(
            <Router history={history}>
                <ReferenceManyFieldView
                    {...defaultProps}
                    data={data}
                    ids={[1, 2]}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyFieldView>
            </Router>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        const links = queryAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/posts/1');
        expect(links[1].getAttribute('href')).toEqual('/posts/2');
    });
});
