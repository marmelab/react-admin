import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { Admin } from './Admin';
import { ApplicationContext } from './ApplicationContext';
// @ts-expect-error
import customers from '../assets/ra-customers.csv?raw';
// @ts-expect-error
import orders1 from '../assets/ra-orders-1.csv?raw';
// @ts-expect-error
import orders2 from '../assets/ra-orders-2.csv?raw';

describe('Admin', () => {
    it('should be functional', async () => {
        localStorage.clear();
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

        userEvents.upload(
            await screen.findByLabelText('CSV File'),
            new File([customers], 'customers.csv', {
                type: 'text/csv',
            })
        );

        await screen.findByDisplayValue('customers');

        fireEvent.click(await screen.findByText('Import'));

        await screen.findByText('Customers', {
            selector: '#react-admin-title *',
        });
        await screen.findByText('Id', { selector: 'th *' });
        await screen.findByText('First name', { selector: 'th *' });
        await screen.findByText('Last name', { selector: 'th *' });
        await screen.findByText('Email', { selector: 'th *' });
        await screen.findByText('Address', { selector: 'th *' });
        await screen.findByText('Zipcode', { selector: 'th *' });
        await screen.findByText('City', { selector: 'th *' });
        await screen.findByText('State abbr', { selector: 'th *' });
        await screen.findByText('Avatar', { selector: 'th *' });
        await screen.findByText('Birthday', { selector: 'th *' });
        await screen.findByText('First seen', { selector: 'th *' });
        await screen.findByText('Last seen', { selector: 'th *' });
        await screen.findByText('Has ordered', { selector: 'th *' });
        await screen.findByText('Latest purchase', { selector: 'th *' });
        await screen.findByText('Has newsletter', { selector: 'th *' });
        await screen.findByText('Nb commands', { selector: 'th *' });
        await screen.findByText('Total spent', { selector: 'th *' });
        await screen.findByText('Groups', { selector: 'th *' });
        await screen.findByText('1-10 of 10');

        fireEvent.click(
            screen.getAllByText('New resource', {
                selector: '[role="menuitem"] *',
            })[0]
        );

        userEvents.upload(
            await screen.findByLabelText('CSV File'),
            new File([orders1], 'orders.csv', {
                type: 'text/csv',
            })
        );

        await screen.findByDisplayValue('orders');

        fireEvent.click(await screen.findByText('Import'));

        await screen.findByText('Orders', { selector: '#react-admin-title *' });
        await screen.findByText('Id', { selector: 'th *' });
        await screen.findByText('Reference', { selector: 'th *' });
        await screen.findByText('Date', { selector: 'th *' });
        await screen.findByText('Customer', { selector: 'th *' });
        await screen.findByText('Basket product', { selector: 'th *' });
        await screen.findByText('Total ex taxes', { selector: 'th *' });
        await screen.findByText('Delivery fees', { selector: 'th *' });
        await screen.findByText('Tax rate', { selector: 'th *' });
        await screen.findByText('Taxes', { selector: 'th *' });
        await screen.findByText('Total', { selector: 'th *' });
        await screen.findByText('Status', { selector: 'th *' });
        await screen.findByText('Returned', { selector: 'th *' });
        await screen.findByText('1-5 of 5');

        fireEvent.click(
            screen.getAllByText('New resource', {
                selector: '[role="menuitem"] *',
            })[0]
        );

        userEvents.upload(
            await screen.findByLabelText('CSV File'),
            new File([orders2], 'orders2.csv', {
                type: 'text/csv',
            })
        );

        const order2El = await screen.findByDisplayValue('orders2');

        fireEvent.change(order2El, {
            target: { value: 'orders' },
        });
        fireEvent.click(await screen.findByText('Import'));

        await screen.findByText('Orders', { selector: '#react-admin-title *' });
        await screen.findByText('1-10 of 12');
    }, 10000);
});
