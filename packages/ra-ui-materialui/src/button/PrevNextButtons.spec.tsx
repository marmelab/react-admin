import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import fakeRestDataProvider from 'ra-data-fakerest';

import {
    Basic,
    ErrorState,
    LoadingState,
    WithFilter,
    WithLimit,
    WithQueryFilter,
} from './PrevNextButtons.stories';

describe('<PrevNextButtons />', () => {
    beforeEach(() => {
        window.scrollTo = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the current record position according to the clicked item in the list', async () => {
        render(<Basic />);
        const tr = await screen.findByText('first_name_3');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        expect(screen.getByText('4 / 900')).toBeDefined();
    });

    it('should render previous button as disabled if there is no previous record', async () => {
        render(<Basic />);
        const tr = await screen.findByText('first_name_0');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        const previousButton = screen.getByLabelText('Go to previous page');
        expect(previousButton).toBeDefined();
        expect(previousButton).toHaveProperty('disabled', true);
    });

    it('should render next button as disabled if there is no next record', async () => {
        render(<Basic />);
        const lastPage = await screen.findByText('90');
        fireEvent.click(lastPage);
        const tr = await screen.findByText('first_name_899');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        const nextButton = screen.getByLabelText('Go to next page');
        expect(nextButton).toBeDefined();
        expect(nextButton).toHaveProperty('disabled', true);
    });

    it('should render a total based on query filter', async () => {
        render(<WithQueryFilter />);
        const input = await screen.findByLabelText('Search');
        fireEvent.change(input, { target: { value: 'city_0' } });
        await screen.findByText('1-10 of 50');
        const item = await screen.findByText('first_name_9');
        fireEvent.click(item);
        await screen.findByRole('navigation');
        await screen.findByText('10 / 50');
    });

    it('should link to the edit view by default', async () => {
        render(<Basic />);
        const row = await screen.findByText('first_name_0');
        fireEvent.click(row);
        fireEvent.click(await screen.findByLabelText('Edit'));
        const next = await screen.findByLabelText('Go to next page');
        fireEvent.click(next);
        expect(screen.getByLabelText('First name').getAttribute('type')).toBe(
            'text'
        );
    });

    it('should render an error UI in case of data provider error', async () => {
        console.error = jest.fn();
        render(<ErrorState />);
        await screen.findByText('error');
    });

    it('should render a loading UI in case of slow data provider response', async () => {
        render(<LoadingState />);
        const progress = await screen.findByRole('progressbar', undefined, {
            timeout: 5000,
        });
        expect(progress).toBeDefined();
    });

    describe('linkType', () => {
        it('should link to the show view when linkType is show', async () => {
            render(<Basic />);
            const row = await screen.findByText('first_name_0');
            fireEvent.click(row);
            const next = await screen.findByLabelText('Go to next page');
            fireEvent.click(next);
            expect(screen.queryByLabelText('First name')).toBeNull();
            expect(screen.getByText('First name')).toBeDefined();
        });
    });

    describe('filter', () => {
        it('should render a total based on filter', async () => {
            render(<WithFilter />);
            const item = await screen.findByText('first_name_5');
            fireEvent.click(item);
            await screen.findByRole('navigation');
            expect(screen.getByText('5 / 50')).toBeDefined();
        });
    });

    describe('limit', () => {
        it('should render the total number of items, even with a limit', async () => {
            render(<WithLimit />);
            const item = await screen.findByText('0');
            fireEvent.click(item);
            await screen.findByText('1 / 900');
        });
        it('should limit the number of items fetched from the data provider', async () => {
            const data = {
                customers: Array.from(Array(900).keys()).map(id => {
                    const first_name = `first_name_${id}`;
                    const last_name = `last_name_${id}`;
                    const email = `first_name_${id}.last_name_${id}@example.com`;

                    return {
                        id,
                        first_name,
                        last_name,
                        email,
                        city: `city_${id}`,
                    };
                }),
            };
            const dataProvider = fakeRestDataProvider(data);
            const spy = jest.spyOn(dataProvider, 'getList');
            render(<WithLimit customDataProvider={dataProvider} />);
            const item = await screen.findByText('9');
            fireEvent.click(item);
            await screen.findByText('10 / 900');
            expect(spy).toHaveBeenCalledWith('customers', {
                pagination: { page: 1, perPage: 500 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
                meta: undefined,
                signal: undefined,
            });
        });
    });

    describe('pagination', () => {
        it('should compute the index correctly when opening first record of page 2', async () => {
            render(<Basic />);
            await screen.findByText('first_name_1');
            fireEvent.click(await screen.findByLabelText('Go to page 2'));
            const tr = await screen.findByText('first_name_10');
            fireEvent.click(tr);
            await screen.findByText('11 / 900');
        });
        it('should compute the index correctly when opening second record of page 2', async () => {
            render(<Basic />);
            await screen.findByText('first_name_1');
            fireEvent.click(await screen.findByLabelText('Go to page 2'));
            const tr = await screen.findByText('first_name_11');
            fireEvent.click(tr);
            await screen.findByText('12 / 900');
        });
        it('should compute the index correctly when opening last record of page 2', async () => {
            render(<Basic />);
            await screen.findByText('first_name_1');
            fireEvent.click(await screen.findByLabelText('Go to page 2'));
            const tr = await screen.findByText('first_name_19');
            fireEvent.click(tr);
            await screen.findByText('20 / 900');
        });
        it('should compute the index correctly when opening first record of page 3', async () => {
            render(<Basic />);
            await screen.findByText('first_name_1');
            fireEvent.click(await screen.findByLabelText('Go to page 3'));
            const tr = await screen.findByText('first_name_20');
            fireEvent.click(tr);
            await screen.findByText('21 / 900');
        });
        it('should compute the index correctly when opening second record of page 3', async () => {
            render(<Basic />);
            await screen.findByText('first_name_5');
            fireEvent.click(await screen.findByLabelText('Go to page 3'));
            const tr = await screen.findByText('first_name_21');
            fireEvent.click(tr);
            await screen.findByText('22 / 900');
        });
        it('should compute the index correctly when opening last record of page 3', async () => {
            render(<Basic />);
            await screen.findByText('first_name_5');
            fireEvent.click(await screen.findByLabelText('Go to page 3'));
            const tr = await screen.findByText('first_name_29');
            fireEvent.click(tr);
            await screen.findByText('30 / 900');
        });
    });
});
