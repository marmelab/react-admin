import * as React from 'react';
import {
    render as baseRender,
    fireEvent,
    screen,
    waitFor,
} from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import {
    ResourceDefinitionContextProvider,
    useRecordContext,
    TestMemoryRouter,
    RecordContextProvider,
} from 'ra-core';

import { AdminContext } from '../../AdminContext';
import DatagridRow from './DatagridRow';
import DatagridContextProvider from './DatagridContextProvider';

const TitleField = (): JSX.Element => {
    const record = useRecordContext();
    return <span>{record?.title}</span>;
};

const ExpandPanel = () => <span>expanded</span>;

// remove validateDomNesting warnings by react-testing-library
const render = element =>
    baseRender(element, {
        wrapper: ({ children }) => {
            return (
                <TestMemoryRouter>
                    <AdminContext>
                        <table>
                            <tbody>{children}</tbody>
                        </table>
                    </AdminContext>
                </TestMemoryRouter>
            );
        },
    });

describe('<DatagridRow />', () => {
    const defaultProps = {
        id: 15,
        resource: 'posts',
    };

    const defaultRecord = { id: 15, title: 'hello' };

    describe('isRowExpandable', () => {
        it('should show the expand button if it returns true', async () => {
            const contextValue = { isRowExpandable: () => true };

            const { queryAllByText, getByText } = render(
                <DatagridContextProvider value={contextValue}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow
                            {...defaultProps}
                            rowClick="expand"
                            expand={<ExpandPanel />}
                        >
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </DatagridContextProvider>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(await screen.findAllByText('expanded')).toHaveLength(1);
        });

        it('should not show the expand button if it returns false', () => {
            const contextValue = { isRowExpandable: () => false };

            const { queryAllByText, getByText } = render(
                <DatagridContextProvider value={contextValue}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow
                            {...defaultProps}
                            rowClick="expand"
                            expand={<ExpandPanel />}
                        >
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
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
        it("should redirect to edit page if the 'edit' option is selected", async () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow {...defaultProps} rowClick="edit">
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);

            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: '/posts/15' })
                );
            });
        });

        it("should redirect to show page if the 'show' option is selected", async () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow {...defaultProps} rowClick="show">
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);

            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: '/posts/15/show' })
                );
            });
        });

        it("should change the expand state if the 'expand' option is selected", async () => {
            render(
                <RecordContextProvider value={defaultRecord}>
                    <DatagridRow
                        {...defaultProps}
                        rowClick="expand"
                        expand={<ExpandPanel />}
                    >
                        <TitleField />
                    </DatagridRow>
                </RecordContextProvider>
            );
            expect(screen.queryAllByText('expanded')).toHaveLength(0);
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await waitFor(() => {
                expect(screen.queryAllByText('expanded')).toHaveLength(1);
            });
            fireEvent.click(row);
            await waitFor(() => {
                expect(screen.queryAllByText('expanded')).toHaveLength(0);
            });
        });

        it("should execute the onToggleItem function if the 'toggleSelection' option is selected", async () => {
            const onToggleItem = jest.fn();
            render(
                <RecordContextProvider value={defaultRecord}>
                    <DatagridRow
                        {...defaultProps}
                        onToggleItem={onToggleItem}
                        rowClick="toggleSelection"
                    >
                        <TitleField />
                    </DatagridRow>
                </RecordContextProvider>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await waitFor(() => {
                expect(onToggleItem.mock.calls.length).toEqual(1);
            });
        });

        it('should not execute the onToggleItem function if the row is not selectable', () => {
            const onToggleItem = jest.fn();
            render(
                <RecordContextProvider value={defaultRecord}>
                    <DatagridRow
                        {...defaultProps}
                        selectable={false}
                        onToggleItem={onToggleItem}
                        rowClick="toggleSelection"
                    >
                        <TitleField />
                    </DatagridRow>
                </RecordContextProvider>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            // FIXME ideally, the row style shouldn't show a pointer in this case
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            expect(onToggleItem).not.toHaveBeenCalled();
        });

        it('should redirect to the custom path if onRowClick is a string', async () => {
            const path = '/foo/bar';
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow {...defaultProps} rowClick={path}>
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: path })
                );
            });
        });

        it('should evaluate the function and redirect to the result of that function if onRowClick is a custom function', async () => {
            const customRowClick = () => '/bar/foo';
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow
                            {...defaultProps}
                            rowClick={customRowClick}
                        >
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await new Promise(resolve => setTimeout(resolve)); // waitFor one tick
            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: '/bar/foo' })
                );
            });
        });

        it('should not call push if onRowClick is false', () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow {...defaultProps} rowClick={false}>
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeFalsy();
            fireEvent.click(row);
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/' })
            );
        });

        it('should not call push if onRowClick is falsy', () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <RecordContextProvider value={defaultRecord}>
                        <DatagridRow {...defaultProps} rowClick="">
                            <TitleField />
                        </DatagridRow>
                    </RecordContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeFalsy();
            fireEvent.click(row);
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/' })
            );
        });

        it("should default to 'edit' if the resource has an edit page", async () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: { name: 'posts', hasEdit: true },
                        }}
                    >
                        <RecordContextProvider value={defaultRecord}>
                            <DatagridRow {...defaultProps}>
                                <TitleField />
                            </DatagridRow>
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: '/posts/15' })
                );
            });
        });

        it("should default to 'show' if the resource has a show page", async () => {
            let spy = jest.fn();
            render(
                <LocationSpy spy={spy}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: { name: 'posts', hasShow: true },
                        }}
                    >
                        <RecordContextProvider value={defaultRecord}>
                            <DatagridRow {...defaultProps}>
                                <TitleField />
                            </DatagridRow>
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: '/posts/15/show' })
                );
            });
        });

        it("should default to 'show' if the resource has both a show and an edit page", async () => {
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
                        <RecordContextProvider value={defaultRecord}>
                            <DatagridRow {...defaultProps}>
                                <TitleField />
                            </DatagridRow>
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeTruthy();
            fireEvent.click(row);
            await waitFor(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({ pathname: '/posts/15/show' })
                );
            });
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
                        <RecordContextProvider value={defaultRecord}>
                            <DatagridRow {...defaultProps}>
                                <TitleField />
                            </DatagridRow>
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </LocationSpy>
            );
            const cell = screen.getByText('hello');
            const row = cell.closest('tr');
            if (!row) {
                throw new Error('row not found');
            }
            expect(
                row.classList.contains('RaDatagrid-clickableRow')
            ).toBeFalsy();
            fireEvent.click(row);
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/' })
            );
        });
    });
});
