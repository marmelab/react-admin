import * as React from 'react';
import {
    render as baseRender,
    fireEvent,
    screen,
} from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { ResourceDefinitionContextProvider, useRecordContext } from 'ra-core';

import { AdminContext } from '../../AdminContext';
import DatagridRow from './DatagridRow';
import DatagridContextProvider from './DatagridContextProvider';
import { createMemoryHistory } from 'history';

const TitleField = (): JSX.Element => {
    const record = useRecordContext();
    return <span>{record.title}</span>;
};

const ExpandPanel = () => <span>expanded</span>;

// remove validateDomNesting warnings by react-testing-library
const render = element =>
    baseRender(element, {
        wrapper: ({ children }) => {
            const history = createMemoryHistory();
            return (
                <AdminContext history={history}>
                    <table>
                        <tbody>{children}</tbody>
                    </table>
                </AdminContext>
            );
        },
    });

describe('<DatagridRow />', () => {
    const defaultProps = {
        id: 15,
        record: { id: 15, title: 'hello' },
        resource: 'posts',
    };

    describe('isRowExpandable', () => {
        it('should show the expand button if it returns true', () => {
            const contextValue = { isRowExpandable: () => true };

            const { queryAllByText, getByText } = render(
                <DatagridContextProvider value={contextValue}>
                    <DatagridRow
                        {...defaultProps}
                        rowClick="expand"
                        expand={<ExpandPanel />}
                    >
                        <TitleField />
                    </DatagridRow>
                </DatagridContextProvider>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(1);
        });

        it('should not show the expand button if it returns false', () => {
            const contextValue = { isRowExpandable: () => false };

            const { queryAllByText, getByText } = render(
                <DatagridContextProvider value={contextValue}>
                    <DatagridRow
                        {...defaultProps}
                        rowClick="expand"
                        expand={<ExpandPanel />}
                    >
                        <TitleField />
                    </DatagridRow>
                </DatagridContextProvider>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(0);
        });
    });

    const LocationSpy = ({ children, spy }) => {
        spy(useLocation());
        return children;
    };

    describe('rowClick', () => {
        it("should redirect to edit page if the 'edit' option is selected", () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <DatagridRow {...defaultProps} rowClick="edit">
                        <TitleField />
                    </DatagridRow>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/posts/15' })
            );
        });

        it("should redirect to show page if the 'show' option is selected", () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <DatagridRow {...defaultProps} rowClick="show">
                        <TitleField />
                    </DatagridRow>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/posts/15/show' })
            );
        });

        it("should change the expand state if the 'expand' option is selected", () => {
            render(
                <DatagridRow
                    {...defaultProps}
                    rowClick="expand"
                    expand={<ExpandPanel />}
                >
                    <TitleField />
                </DatagridRow>
            );
            expect(screen.queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(screen.getByText('hello'));
            expect(screen.queryAllByText('expanded')).toHaveLength(1);
            fireEvent.click(screen.getByText('hello'));
            expect(screen.queryAllByText('expanded')).toHaveLength(0);
        });

        it("should execute the onToggleItem function if the 'toggleSelection' option is selected", () => {
            const onToggleItem = jest.fn();
            const { getByText } = render(
                <DatagridRow
                    {...defaultProps}
                    onToggleItem={onToggleItem}
                    rowClick="toggleSelection"
                >
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(onToggleItem.mock.calls.length).toEqual(1);
        });

        it('should not execute the onToggleItem function if the row is not selectable', () => {
            const onToggleItem = jest.fn();
            const { getByText } = render(
                <DatagridRow
                    {...defaultProps}
                    selectable={false}
                    onToggleItem={onToggleItem}
                    rowClick="toggleSelection"
                >
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(onToggleItem).not.toHaveBeenCalled();
        });

        it('should redirect to the custom path if onRowClick is a string', () => {
            const path = '/foo/bar';
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <DatagridRow {...defaultProps} rowClick={path}>
                        <TitleField />
                    </DatagridRow>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: path })
            );
        });

        it('should evaluate the function and redirect to the result of that function if onRowClick is a custom function', async () => {
            const customRowClick = () => '/bar/foo';
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <DatagridRow {...defaultProps} rowClick={customRowClick}>
                        <TitleField />
                    </DatagridRow>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            await new Promise(resolve => setTimeout(resolve)); // waitFor one tick
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/bar/foo' })
            );
        });

        it('should not call push if onRowClick is false', () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <DatagridRow {...defaultProps} rowClick={false}>
                        <TitleField />
                    </DatagridRow>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/' })
            );
        });

        it('should not call push if onRowClick is falsy', () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <DatagridRow {...defaultProps} rowClick="">
                        <TitleField />
                    </DatagridRow>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/' })
            );
        });

        it("should default to 'edit' if the resource has an edit page", () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: { name: 'posts', hasEdit: true },
                        }}
                    >
                        <DatagridRow {...defaultProps}>
                            <TitleField />
                        </DatagridRow>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/posts/15' })
            );
        });

        it("should default to 'show' if the resource has a show page", () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: { name: 'posts', hasShow: true },
                        }}
                    >
                        <DatagridRow {...defaultProps}>
                            <TitleField />
                        </DatagridRow>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/posts/15/show' })
            );
        });

        it("should default to 'show' if the resource has both a show and an edit page", () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                hasShow: true,
                                hasEdit: true,
                            },
                        }}
                    >
                        <DatagridRow {...defaultProps}>
                            <TitleField />
                        </DatagridRow>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/posts/15/show' })
            );
        });

        it('should default to false if the resource has no show nor edit page', () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                hasList: true,
                            },
                        }}
                    >
                        <DatagridRow {...defaultProps}>
                            <TitleField />
                        </DatagridRow>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            fireEvent.click(screen.getByText('hello'));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/' })
            );
        });
    });
});
