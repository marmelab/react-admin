import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { address, internet, name } from 'faker/locale/en_GB';
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
        // avoid logs due to the use of ListGuesser
        console.log = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the current record position according to the clicked item in the list', async () => {
        render(<Basic />);
        const tr = await screen.findByText('Deja');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        expect(screen.getByText('4 / 900')).toBeDefined();
    });

    it('should render previous button as disabled if there is no previous record', async () => {
        render(<Basic />);
        const tr = await screen.findByText('Maurine');
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
        const tr = await screen.findByText('Maxwell');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        const nextButton = screen.getByLabelText('Go to next page');
        expect(nextButton).toBeDefined();
        expect(nextButton).toHaveProperty('disabled', true);
    });

    it('should render a total based on query filter', async () => {
        render(<WithQueryFilter />);
        const input = await screen.findByLabelText('Search');
        fireEvent.change(input, { target: { value: 'east' } });
        const item = await screen.findByText('217');
        fireEvent.click(item);
        await screen.findByRole('navigation');
        expect(screen.getByText('10 / 57')).toBeDefined();
    });

    it('should link to the edit view by default', async () => {
        render(<Basic />);
        const row = await screen.findByText('Deja');
        fireEvent.click(row);
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
        const progress = await screen.findByRole('progressbar');
        expect(progress).toBeDefined();
    });

    describe('linkType', () => {
        it('should link to the show view when linkType is show', async () => {
            render(<Basic />);
            const row = await screen.findByText('Deja');
            fireEvent.click(row);
            fireEvent.click(screen.getByLabelText('Show'));
            const next = await screen.findByLabelText('Go to next page');
            fireEvent.click(next);
            expect(screen.queryByLabelText('First name')).toBeNull();
            expect(screen.getByText('First name')).toBeDefined();
        });
    });

    describe('filter', () => {
        it('should render a total based on filter', async () => {
            render(<WithFilter />);
            const item = await screen.findByText('822');
            fireEvent.click(item);
            await screen.findByRole('navigation');
            expect(screen.getByText('1 / 5')).toBeDefined();
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
                    const first_name = name.firstName();
                    const last_name = name.lastName();
                    const email = internet.email(first_name, last_name);

                    return {
                        id,
                        first_name,
                        last_name,
                        email,
                        city: address.city(),
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
            });
        });
    });
});
