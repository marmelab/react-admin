import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import SingleFieldList from './SingleFieldList';
import ChipField from '../field/ChipField';

const renderWithRouter = children => {
    const history = createMemoryHistory();

    return {
        history,
        ...render(<Router history={history}>{children}</Router>),
    };
};

describe('<SingleFieldList />', () => {
    afterEach(cleanup);

    it('should render a link to the Edit page of the related record by default', () => {
        const { queryAllByRole } = renderWithRouter(
            <SingleFieldList
                ids={[1, 2]}
                data={{
                    1: { id: 1, title: 'foo' },
                    2: { id: 2, title: 'bar' },
                }}
                resource="posts"
                basePath="/posts"
            >
                <ChipField source="title" />
            </SingleFieldList>
        );
        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/posts/1',
            '/posts/2',
        ]);
    });

    it('should render a link to the Edit page of the related record when the resource contains slashes', () => {
        const { queryAllByRole } = renderWithRouter(
            <SingleFieldList
                ids={[1, 2]}
                data={{
                    1: { id: 1, title: 'foo' },
                    2: { id: 2, title: 'bar' },
                }}
                resource="posts"
                basePath="/posts"
            >
                <ChipField source="title" />
            </SingleFieldList>
        );
        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/posts/1',
            '/posts/2',
        ]);
    });

    it('should render a link to the Edit page of the related record when the resource is named edit or show', () => {
        ['edit', 'show'].forEach(action => {
            const { queryAllByRole } = renderWithRouter(
                <SingleFieldList
                    ids={[1, 2]}
                    data={{
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    }}
                    resource={action}
                    basePath={`/${action}`}
                >
                    <ChipField source="title" />
                </SingleFieldList>
            );
            const linkElements = queryAllByRole('link');
            expect(linkElements).toHaveLength(2);
            expect(linkElements.map(link => link.getAttribute('href'))).toEqual(
                [`/${action}/1`, `/${action}/2`]
            );
            cleanup();
        });
    });

    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const { queryAllByRole } = renderWithRouter(
            <SingleFieldList
                ids={[1, 2]}
                data={{
                    1: { id: 1, title: 'foo' },
                    2: { id: 2, title: 'bar' },
                }}
                resource="prefix/bar"
                basePath="/prefix/bar"
                linkType="show"
            >
                <ChipField source="title" />
            </SingleFieldList>
        );

        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/prefix/bar/1/show',
            '/prefix/bar/2/show',
        ]);
    });

    it('should render a link to the Edit page of the related record when the resource is named edit or show and linkType is show', () => {
        ['edit', 'show'].forEach(action => {
            const { queryAllByRole } = renderWithRouter(
                <SingleFieldList
                    ids={[1, 2]}
                    data={{
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    }}
                    resource={action}
                    basePath={`/${action}`}
                    linkType="show"
                >
                    <ChipField source="title" />
                </SingleFieldList>
            );
            const linkElements = queryAllByRole('link');
            expect(linkElements).toHaveLength(2);
            expect(linkElements.map(link => link.getAttribute('href'))).toEqual(
                [`/${action}/1/show`, `/${action}/2/show`]
            );
            cleanup();
        });
    });

    it('should render no link when the linkType is false', () => {
        const { queryAllByRole, queryByText } = renderWithRouter(
            <SingleFieldList
                ids={[1, 2]}
                data={{
                    1: { id: 1, title: 'foo' },
                    2: { id: 2, title: 'bar' },
                }}
                resource="bar"
                basePath="/bar"
                linkType={false}
            >
                <ChipField source="title" />
            </SingleFieldList>
        );

        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(0);
        expect(queryByText('foo')).not.toBeNull();
        expect(queryByText('bar')).not.toBeNull();
    });
});
