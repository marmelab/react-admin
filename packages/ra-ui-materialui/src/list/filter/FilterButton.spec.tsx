import * as React from 'react';
import expect from 'expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@mui/material/styles';
import {
    ListContextProvider,
    ListControllerResult,
    ResourceContextProvider,
} from 'ra-core';

import { AdminContext } from '../../AdminContext';
import { FilterButton } from './FilterButton';
import { TextInput } from '../../input';
import { Basic, WithAutoCompleteArrayInput } from './FilterButton.stories';

const theme = createTheme();

describe('<FilterButton />', () => {
    const defaultListContext = {
        resource: 'post',
        displayedFilters: {
            title: true,
            'customer.name': true,
        },
        showFilter: () => {},
        filterValues: {},
    } as unknown as ListControllerResult;

    const defaultProps = {
        filters: [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ],
    };

    beforeAll(() => {
        window.scrollTo = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('filter selection menu', () => {
        it('should control filters display by checking/unchecking them in the menu', async () => {
            render(<Basic />);

            fireEvent.click(await screen.findByLabelText('Add filter'));

            let checkboxes: HTMLInputElement[] =
                screen.getAllByRole('menuitemcheckbox');
            expect(checkboxes).toHaveLength(3);
            expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[1].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[2].getAttribute('aria-checked')).toBe('false');

            fireEvent.click(checkboxes[0]);

            await screen.findByRole('textbox', {
                name: 'Title',
            });
            fireEvent.click(screen.getByLabelText('Add filter'));

            checkboxes = screen.getAllByRole('menuitemcheckbox');
            expect(checkboxes).toHaveLength(3);
            expect(checkboxes[0].getAttribute('aria-checked')).toBe('true');
            expect(checkboxes[1].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[2].getAttribute('aria-checked')).toBe('false');

            fireEvent.click(checkboxes[0]);

            await waitFor(
                () => {
                    expect(
                        screen.queryByRole('textbox', {
                            name: 'Title',
                        })
                    ).toBeNull();
                },
                { timeout: 2000 }
            );

            fireEvent.click(screen.getByLabelText('Add filter'));
            checkboxes = screen.getAllByRole('menuitemcheckbox');
            expect(checkboxes).toHaveLength(3);
            expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[1].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[2].getAttribute('aria-checked')).toBe('false');
        }, 7000);

        it('should remove the checked state of the menu item when removing its matching filter', async () => {
            render(<Basic />);

            fireEvent.click(await screen.findByLabelText('Add filter'));

            let checkboxes: HTMLInputElement[] =
                screen.getAllByRole('menuitemcheckbox');
            fireEvent.click(checkboxes[0]);

            await screen.findByRole('textbox', {
                name: 'Title',
            });

            fireEvent.click(screen.getByTitle('Remove this filter'));

            await waitFor(
                () => {
                    expect(
                        screen.queryByRole('textbox', {
                            name: 'Title',
                        })
                    ).toBeNull();
                },
                { timeout: 2000 }
            );

            fireEvent.click(screen.getByLabelText('Add filter'));
            checkboxes = screen.getAllByRole('menuitemcheckbox');
            expect(checkboxes).toHaveLength(3);
            expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[1].getAttribute('aria-checked')).toBe('false');
            expect(checkboxes[2].getAttribute('aria-checked')).toBe('false');
        });

        it('should display the filter button if all filters are shown and there is a filter value', () => {
            render(
                <AdminContext theme={theme}>
                    <ResourceContextProvider value="posts">
                        <ListContextProvider
                            value={{
                                ...defaultListContext,
                                displayedFilters: {
                                    title: true,
                                    'customer.name': true,
                                },
                                filterValues: { title: 'foo' },
                            }}
                        >
                            <FilterButton
                                filters={[
                                    <TextInput source="title" label="Title" />,
                                    <TextInput
                                        source="customer.name"
                                        label="Name"
                                    />,
                                ]}
                            />
                        </ListContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(
                screen.queryByLabelText('ra.action.add_filter')
            ).not.toBeNull();
            fireEvent.click(screen.getByLabelText('ra.action.add_filter'));
            screen.getByText('ra.saved_queries.new_label');
        });

        it('should return disabled filter menu item when "disabled" passed to filter', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" disabled={true} />
            );
            const { getByLabelText, queryByText } = render(
                <AdminContext theme={theme}>
                    <ResourceContextProvider value="posts">
                        <ListContextProvider value={defaultListContext}>
                            <FilterButton
                                filters={defaultProps.filters.concat(
                                    hiddenFilter
                                )}
                            />
                        </ListContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            const disabledFilter = queryByText('Returned')?.closest('li');

            expect(disabledFilter).not.toBeNull();
            expect(disabledFilter?.getAttribute('aria-disabled')).toEqual(
                'true'
            );
        });

        it('should remove all filters when the "Remove all filters" button is clicked', async () => {
            render(<Basic />);

            // First, check we don't have a clear filters option yet
            await screen.findByText('Add filter');
            fireEvent.click(screen.getByText('Add filter'));

            await screen.findByText('Title', { selector: 'li span' });
            expect(screen.queryByDisplayValue('Remove all filters')).toBeNull();

            // Then we apply a filter
            fireEvent.click(screen.getByText('Title', { selector: 'li span' }));
            await screen.findByDisplayValue(
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
            );

            // Then we clear all filters
            fireEvent.click(screen.getByText('Add filter'));
            await screen.findByText('Remove all filters');
            fireEvent.click(screen.getByText('Remove all filters'));

            // We check that the previously applied filter has been removed
            await waitFor(() => {
                expect(
                    screen.queryByDisplayValue(
                        'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
                    )
                ).toBeNull();
            });
        });

        it('should remove all alwaysOn filters when the "Remove all filters" button is clicked', async () => {
            render(<Basic />);

            // First, check we don't have a clear filters option yet
            await screen.findByText('Add filter');
            fireEvent.click(screen.getByText('Add filter'));

            await screen.findByText('Title', { selector: 'li span' });
            expect(screen.queryByDisplayValue('Remove all filters')).toBeNull();

            // Then we apply a filter to an alwaysOn filter
            fireEvent.change(screen.getByLabelText('Search'), {
                target: {
                    value: 'Accusantium qui nihil voluptatum quia voluptas maxime ab similique',
                },
            });
            await screen.findByDisplayValue(
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
            );

            // Then we clear all filters
            fireEvent.click(screen.getByText('Add filter'));
            await screen.findByText('Remove all filters');
            fireEvent.click(screen.getByText('Remove all filters'));

            // We check that the previously applied filter has been removed
            await waitFor(() => {
                expect(
                    screen.queryByDisplayValue(
                        'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
                    )
                ).toBeNull();
            });
        });

        it('should not display save query in filter button', async () => {
            const { queryByText } = render(
                <AdminContext theme={theme}>
                    <ResourceContextProvider value="posts">
                        <ListContextProvider
                            value={{
                                ...defaultListContext,
                                filterValues: { title: 'foo' },
                            }}
                        >
                            <FilterButton
                                filters={[
                                    <TextInput
                                        source="Returned"
                                        label="Returned"
                                    />,
                                ]}
                                disableSaveQuery
                            />
                        </ListContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(
                screen.queryByLabelText('ra.action.add_filter')
            ).not.toBeNull();

            fireEvent.click(screen.getByLabelText('ra.action.add_filter'));

            await screen.findByText('Returned');

            expect(queryByText('ra.saved_queries.new_label')).toBeNull();
        });

        it('should close the filter menu on removing all filters', async () => {
            render(<WithAutoCompleteArrayInput />);

            // Open Posts List
            userEvent.click(await screen.findByText('Posts'));

            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });

            userEvent.click(await screen.findByLabelText('Open'));
            userEvent.click(await screen.findByText('Sint...'));

            await screen.findByLabelText('Add filter');
            expect(screen.queryAllByText('Close')).toHaveLength(0);
            await waitFor(
                () => {
                    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
                },
                { timeout: 10000 }
            );
            userEvent.click(screen.getByLabelText('Add filter'));
            userEvent.click(await screen.findByText('Remove all filters'));

            await waitFor(
                () => {
                    expect(screen.getAllByRole('checkbox')).toHaveLength(11);
                },
                { timeout: 10000 }
            );

            userEvent.click(await screen.findByLabelText('Open'));
            userEvent.click(await screen.findByText('Sint...'));

            await waitFor(
                () => {
                    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
                },
                { timeout: 10000 }
            );

            expect(screen.queryByText('Save current query...')).toBeNull();
        }, 20000);
    });
});
