import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import { Admin } from './Admin';
import { ApplicationContext } from './ApplicationContext';

describe('Admin', () => {
    it('should be functional', async () => {
        const customers = fs.readFileSync(
            path.resolve(__dirname, '../assets/ra-customers.csv'),
            {
                encoding: 'utf-8',
            }
        );
        const orders1 = fs.readFileSync(
            path.resolve(__dirname, '../assets/ra-orders-1.csv'),
            {
                encoding: 'utf-8',
            }
        );
        const orders2 = fs.readFileSync(
            path.resolve(__dirname, '../assets/ra-orders-2.csv'),
            {
                encoding: 'utf-8',
            }
        );

        let file = new File([customers], 'customers.csv', {
            type: 'text/csv',
        });
        const { getByLabelText, getByText, getByDisplayValue } = render(
            <ApplicationContext.Provider
                value={{
                    application: { name: 'test', created_at: new Date() },
                    onExit: () => {},
                }}
            >
                <Admin />
            </ApplicationContext.Provider>
        );

        userEvents.upload(getByLabelText('CSV File'), file);

        await waitFor(() => {
            getByDisplayValue('customers');
        });

        fireEvent.click(getByText('Import'));

        await waitFor(() => {
            getByText('Customers', { selector: '#react-admin-title *' });
            getByText('Id', { selector: 'th *' });
            getByText('First name', { selector: 'th *' });
            getByText('Last name', { selector: 'th *' });
            getByText('Email', { selector: 'th *' });
            getByText('Address', { selector: 'th *' });
            getByText('Zipcode', { selector: 'th *' });
            getByText('City', { selector: 'th *' });
            getByText('State abbr', { selector: 'th *' });
            getByText('Avatar', { selector: 'th *' });
            getByText('Birthday', { selector: 'th *' });
            getByText('First seen', { selector: 'th *' });
            getByText('Last seen', { selector: 'th *' });
            getByText('Has ordered', { selector: 'th *' });
            getByText('Latest purchase', { selector: 'th *' });
            getByText('Has newsletter', { selector: 'th *' });
            getByText('Nb commands', { selector: 'th *' });
            getByText('Total spent', { selector: 'th *' });
            getByText('Groups', { selector: 'th *' });
            getByText('1-10 of 10');
        });

        fireEvent.click(getByText('New resource', { selector: 'button *' }));

        file = new File([orders1], 'orders.csv', {
            type: 'text/csv',
        });
        userEvents.upload(getByLabelText('CSV File'), file);

        await waitFor(() => {
            getByDisplayValue('orders');
        });
        fireEvent.click(getByText('Import'));

        await waitFor(() => {
            getByText('Orders', { selector: '#react-admin-title *' });
            getByText('Id', { selector: 'th *' });
            getByText('Reference', { selector: 'th *' });
            getByText('Date', { selector: 'th *' });
            getByText('Customer', { selector: 'th *' });
            getByText('Basket.product', { selector: 'th *' });
            getByText('Total ex taxes', { selector: 'th *' });
            getByText('Delivery fees', { selector: 'th *' });
            getByText('Tax rate', { selector: 'th *' });
            getByText('Taxes', { selector: 'th *' });
            getByText('Total', { selector: 'th *' });
            getByText('Status', { selector: 'th *' });
            getByText('Returned', { selector: 'th *' });
            getByText('1-5 of 5');
        });

        fireEvent.click(getByText('New resource', { selector: 'button *' }));

        file = new File([orders2], 'orders2.csv', {
            type: 'text/csv',
        });
        userEvents.upload(getByLabelText('CSV File'), file);

        await waitFor(() => {
            getByDisplayValue('orders2');
        });
        fireEvent.change(getByDisplayValue('orders2'), {
            target: { value: 'orders' },
        });
        fireEvent.click(getByText('Import'));

        await waitFor(() => {
            getByText('Orders', { selector: '#react-admin-title *' });
            getByText('1-10 of 12');
        });
    });
});
