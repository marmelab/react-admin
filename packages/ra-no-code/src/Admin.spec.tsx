import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
        render(
            <ApplicationContext.Provider
                value={{
                    application: { name: 'test', created_at: new Date() },
                    onExit: () => {},
                }}
            >
                <Admin />
            </ApplicationContext.Provider>
        );

        userEvents.upload(screen.getByLabelText('CSV File'), file);

        await waitFor(() => {
            screen.getByDisplayValue('customers');
        });

        fireEvent.click(screen.getByText('Import'));

        await waitFor(() => {
            screen.getByText('Customers', { selector: '#react-admin-title *' });
        });
        screen.getByText('Id', { selector: 'th *' });
        screen.getByText('First name', { selector: 'th *' });
        screen.getByText('Last name', { selector: 'th *' });
        screen.getByText('Email', { selector: 'th *' });
        screen.getByText('Address', { selector: 'th *' });
        screen.getByText('Zipcode', { selector: 'th *' });
        screen.getByText('City', { selector: 'th *' });
        screen.getByText('State abbr', { selector: 'th *' });
        screen.getByText('Avatar', { selector: 'th *' });
        screen.getByText('Birthday', { selector: 'th *' });
        screen.getByText('First seen', { selector: 'th *' });
        screen.getByText('Last seen', { selector: 'th *' });
        screen.getByText('Has ordered', { selector: 'th *' });
        screen.getByText('Latest purchase', { selector: 'th *' });
        screen.getByText('Has newsletter', { selector: 'th *' });
        screen.getByText('Nb commands', { selector: 'th *' });
        screen.getByText('Total spent', { selector: 'th *' });
        screen.getByText('Groups', { selector: 'th *' });
        screen.getByText('1-10 of 10');

        fireEvent.click(
            screen.getAllByText('New resource', {
                selector: '[role="menuitem"] *',
            })[0]
        );

        file = new File([orders1], 'orders.csv', {
            type: 'text/csv',
        });
        userEvents.upload(screen.getByLabelText('CSV File'), file);

        await waitFor(() => {
            screen.getByDisplayValue('orders');
        });
        fireEvent.click(screen.getByText('Import'));

        await waitFor(() => {
            screen.getByText('Orders', { selector: '#react-admin-title *' });
        });
        screen.getByText('Id', { selector: 'th *' });
        screen.getByText('Reference', { selector: 'th *' });
        screen.getByText('Date', { selector: 'th *' });
        screen.getByText('Customer', { selector: 'th *' });
        screen.getByText('Basket.product', { selector: 'th *' });
        screen.getByText('Total ex taxes', { selector: 'th *' });
        screen.getByText('Delivery fees', { selector: 'th *' });
        screen.getByText('Tax rate', { selector: 'th *' });
        screen.getByText('Taxes', { selector: 'th *' });
        screen.getByText('Total', { selector: 'th *' });
        screen.getByText('Status', { selector: 'th *' });
        screen.getByText('Returned', { selector: 'th *' });
        screen.getByText('1-5 of 5');

        fireEvent.click(
            screen.getAllByText('New resource', {
                selector: '[role="menuitem"] *',
            })[0]
        );

        file = new File([orders2], 'orders2.csv', {
            type: 'text/csv',
        });
        userEvents.upload(screen.getByLabelText('CSV File'), file);

        await waitFor(() => {
            screen.getByDisplayValue('orders2');
        });
        fireEvent.change(screen.getByDisplayValue('orders2'), {
            target: { value: 'orders' },
        });
        fireEvent.click(screen.getByText('Import'));

        await waitFor(() => {
            screen.getByText('Orders', { selector: '#react-admin-title *' });
            screen.getByText('1-10 of 12');
        });
    }, 10000);
});
