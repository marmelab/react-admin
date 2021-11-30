import * as React from 'react';
import { screen } from '@testing-library/react';
import { ListContext, ResourceContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SingleFieldList } from './SingleFieldList';
import { ChipField } from '../field';

const theme = createTheme();

describe('<SingleFieldList />', () => {
    it('should render a link to the Edit page of the related record by default', () => {
        renderWithRedux(
            <ThemeProvider theme={theme}>
                <ResourceContextProvider value="posts">
                    <ListContext.Provider
                        value={{
                            data: [
                                { id: 1, title: 'foo' },
                                { id: 2, title: 'bar' },
                            ],
                            resource: 'posts',
                        }}
                    >
                        <SingleFieldList>
                            <ChipField source="title" />
                        </SingleFieldList>
                    </ListContext.Provider>
                </ResourceContextProvider>
            </ThemeProvider>
        );
        const linkElements = screen.queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/posts/1',
            '/posts/2',
        ]);
    });

    it('should render a link to the Edit page of the related record when the resource contains slashes', () => {
        renderWithRedux(
            <ThemeProvider theme={theme}>
                <ResourceContextProvider value="posts/foo">
                    <ListContext.Provider
                        value={{
                            data: [
                                { id: 1, title: 'foo' },
                                { id: 2, title: 'bar' },
                            ],
                        }}
                    >
                        <SingleFieldList>
                            <ChipField source="title" />
                        </SingleFieldList>
                    </ListContext.Provider>
                </ResourceContextProvider>
            </ThemeProvider>
        );
        const linkElements = screen.queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/posts/foo/1',
            '/posts/foo/2',
        ]);
    });

    ['edit', 'show'].forEach(action => {
        it(`should render a link to the Edit page of the related record when the resource is named ${action}`, () => {
            renderWithRedux(
                <ThemeProvider theme={theme}>
                    <ResourceContextProvider value={action}>
                        <ListContext.Provider
                            value={{
                                data: [
                                    { id: 1, title: 'foo' },
                                    { id: 2, title: 'bar' },
                                ],
                                resource: action,
                            }}
                        >
                            <SingleFieldList>
                                <ChipField source="title" />
                            </SingleFieldList>
                        </ListContext.Provider>
                    </ResourceContextProvider>
                </ThemeProvider>
            );
            const linkElements = screen.queryAllByRole('link');
            expect(linkElements).toHaveLength(2);
            expect(
                linkElements.map(link => link.getAttribute('href'))
            ).toEqual([`/${action}/1`, `/${action}/2`]);
        });
    });

    it('should render a link to the Show page of the related record when the linkType is show', () => {
        renderWithRedux(
            <ThemeProvider theme={theme}>
                <ResourceContextProvider value="prefix/bar">
                    <ListContext.Provider
                        value={{
                            data: [
                                { id: 1, title: 'foo' },
                                { id: 2, title: 'bar' },
                            ],
                            resource: 'prefix/bar',
                        }}
                    >
                        <SingleFieldList linkType="show">
                            <ChipField source="title" />
                        </SingleFieldList>
                    </ListContext.Provider>
                </ResourceContextProvider>
            </ThemeProvider>
        );

        const linkElements = screen.queryAllByRole('link');
        expect(linkElements).toHaveLength(2);
        expect(linkElements.map(link => link.getAttribute('href'))).toEqual([
            '/prefix/bar/1/show',
            '/prefix/bar/2/show',
        ]);
    });

    ['edit', 'show'].forEach(action => {
        it(`should render a link to the Edit page of the related record when the resource is named ${action} and linkType is show`, () => {
            renderWithRedux(
                <ThemeProvider theme={theme}>
                    <ResourceContextProvider value={action}>
                        <ListContext.Provider
                            value={{
                                data: [
                                    { id: 1, title: 'foo' },
                                    { id: 2, title: 'bar' },
                                ],
                                resource: action,
                            }}
                        >
                            <SingleFieldList linkType="show">
                                <ChipField source="title" />
                            </SingleFieldList>
                        </ListContext.Provider>
                    </ResourceContextProvider>
                </ThemeProvider>
            );
            const linkElements = screen.queryAllByRole('link');
            expect(linkElements).toHaveLength(2);
            expect(
                linkElements.map(link => link.getAttribute('href'))
            ).toEqual([`/${action}/1/show`, `/${action}/2/show`]);
        });
    });

    it('should render no link when the linkType is false', () => {
        renderWithRedux(
            <ThemeProvider theme={theme}>
                <ListContext.Provider
                    value={{
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'bar' },
                        ],
                        resource: 'bar',
                    }}
                >
                    <SingleFieldList linkType={false}>
                        <ChipField source="title" />
                    </SingleFieldList>
                </ListContext.Provider>
            </ThemeProvider>
        );

        const linkElements = screen.queryAllByRole('link');
        expect(linkElements).toHaveLength(0);
        expect(screen.queryByText('foo')).not.toBeNull();
        expect(screen.queryByText('bar')).not.toBeNull();
    });
});
