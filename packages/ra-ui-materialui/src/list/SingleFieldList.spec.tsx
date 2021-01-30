import * as React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ListContext } from 'ra-core';

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
    it('should render a link to the Edit page of the related record by default', () => {
        const { queryAllByRole } = renderWithRouter(
            <ListContext.Provider
                value={{
                    ids: [1, 2],
                    data: {
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    },
                    resource: 'posts',
                    basePath: '/posts',
                }}
            >
                <SingleFieldList>
                    <ChipField source="title" />
                </SingleFieldList>
            </ListContext.Provider>
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
            <ListContext.Provider
                value={{
                    ids: [1, 2],
                    data: {
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    },
                    resource: 'posts/foo',
                    basePath: '/posts/foo',
                }}
            >
                <SingleFieldList>
                    <ChipField source="title" />
                </SingleFieldList>
            </ListContext.Provider>
        );
        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/posts/foo/1',
            '/posts/foo/2',
        ]);
    });

    ['edit', 'show'].forEach(action => {
        it(`should render a link to the Edit page of the related record when the resource is named ${action}`, () => {
            const { queryAllByRole } = renderWithRouter(
                <ListContext.Provider
                    value={{
                        ids: [1, 2],
                        data: {
                            1: { id: 1, title: 'foo' },
                            2: { id: 2, title: 'bar' },
                        },
                        resource: action,
                        basePath: `/${action}`,
                    }}
                >
                    <SingleFieldList>
                        <ChipField source="title" />
                    </SingleFieldList>
                </ListContext.Provider>
            );
            const linkElements = queryAllByRole('link');
            expect(linkElements).toHaveLength(2);
            expect(
                linkElements.map(link => link.getAttribute('href'))
            ).toEqual([`/${action}/1`, `/${action}/2`]);
        });
    });

    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const { queryAllByRole } = renderWithRouter(
            <ListContext.Provider
                value={{
                    ids: [1, 2],
                    data: {
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    },
                    resource: 'prefix/bar',
                    basePath: '/prefix/bar',
                }}
            >
                <SingleFieldList linkType="show">
                    <ChipField source="title" />
                </SingleFieldList>
            </ListContext.Provider>
        );

        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/prefix/bar/1/show',
            '/prefix/bar/2/show',
        ]);
    });

    ['edit', 'show'].forEach(action => {
        it(`should render a link to the Edit page of the related record when the resource is named ${action} and linkType is show`, () => {
            const { queryAllByRole } = renderWithRouter(
                <ListContext.Provider
                    value={{
                        ids: [1, 2],
                        data: {
                            1: { id: 1, title: 'foo' },
                            2: { id: 2, title: 'bar' },
                        },
                        resource: action,
                        basePath: `/${action}`,
                    }}
                >
                    <SingleFieldList linkType="show">
                        <ChipField source="title" />
                    </SingleFieldList>
                </ListContext.Provider>
            );
            const linkElements = queryAllByRole('link');
            expect(linkElements).toHaveLength(2);
            expect(
                linkElements.map(link => link.getAttribute('href'))
            ).toEqual([`/${action}/1/show`, `/${action}/2/show`]);
        });
    });

    it('should render no link when the linkType is false', () => {
        const { queryAllByRole, queryByText } = renderWithRouter(
            <ListContext.Provider
                value={{
                    ids: [1, 2],
                    data: {
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    },
                    resource: 'bar',
                    basePath: '/bar',
                }}
            >
                <SingleFieldList linkType={false}>
                    <ChipField source="title" />
                </SingleFieldList>
            </ListContext.Provider>
        );

        const linkElements = queryAllByRole('link');
        expect(linkElements).toHaveLength(0);
        expect(queryByText('foo')).not.toBeNull();
        expect(queryByText('bar')).not.toBeNull();
    });
});
