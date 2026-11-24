import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import { Admin } from './Admin';
import { ApplicationContext } from './ApplicationContext';

describe('Admin', () => {
    it('should be functional', async () => {
        const customersPromise = fs.promises.readFile(
            path.resolve(__dirname, '../assets/ra-customers.csv'),
            {
                encoding: 'utf-8',
            }
        );
        const orders1Promise = fs.promises.readFile(
            path.resolve(__dirname, '../assets/ra-orders-1.csv'),
            {
                encoding: 'utf-8',
            }
        );
        const orders2Promise = fs.promises.readFile(
            path.resolve(__dirname, '../assets/ra-orders-2.csv'),
            {
                encoding: 'utf-8',
            }
        );

        const [customers, orders1, orders2] = await Promise.all([
            customersPromise,
            orders1Promise,
            orders2Promise,
        ]);

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

        await waitFor(() => {
            screen.getByLabelText('CSV File');
        });

        userEvents.upload(screen.getByLabelText('CSV File'), file);

        await screen.findByDisplayValue('customers');

        fireEvent.click(screen.getByText('Import'));

        await waitFor(() => {
            screen.getByText('Customers', { selector: '#react-admin-title *' });
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

        file = new File([orders1], 'orders.csv', {
            type: 'text/csv',
        });
        userEvents.upload(screen.getByLabelText('CSV File'), file);

        await screen.findByDisplayValue('orders');

        fireEvent.click(screen.getByText('Import'));

        await waitFor(() => {
            screen.getByText('Orders', { selector: '#react-admin-title *' });
        });
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

        file = new File([orders2], 'orders2.csv', {
            type: 'text/csv',
        });
        userEvents.upload(screen.getByLabelText('CSV File'), file);

        const order2El = await screen.findByDisplayValue('orders2');

        fireEvent.change(order2El, {
            target: { value: 'orders' },
        });
        fireEvent.click(screen.getByText('Import'));

        await screen.findByText('Orders', { selector: '#react-admin-title *' });
        await screen.findByText('1-10 of 12');
    }, 10000);

    it('should ignore CSV headers that are not record paths', async () => {
        window.localStorage.clear();
        window.location.hash = '';
        const file = new File(
            [
                'id,address.city,address.valueOf.extra,city,city.isPrototypeOf.extra,country.propertyIsEnumerable.extra,tags.0,tags.push.extra,toLocaleString[extra]\n' +
                    '1,Paris,yes,Paris,yes,yes,a,yes,true\n' +
                    '2,Rome,yes,Rome,yes,yes,b,yes\n',
            ],
            'people.csv',
            { type: 'text/csv' }
        );
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
        try {
            userEvents.upload(await screen.findByLabelText('CSV File'), file);
            await screen.findByDisplayValue('people');
            fireEvent.click(screen.getByText('Import'));
            await screen.findByText('People', {
                selector: '#react-admin-title *',
            });
            await screen.findByText('1-2 of 2');
            expect(Object.keys({}.valueOf)).toEqual([]);
            expect(Object.keys({}.isPrototypeOf)).toEqual([]);
            expect(Object.keys({}.propertyIsEnumerable)).toEqual([]);
            expect(Object.keys([].push)).toEqual([]);
            expect(Object.keys({}.toLocaleString)).toEqual([]);
        } finally {
            delete ({}.valueOf as any).extra;
            delete ({}.isPrototypeOf as any).extra;
            delete ({}.propertyIsEnumerable as any).extra;
            delete ([].push as any).extra;
            delete ({}.toLocaleString as any).extra;
        }
    });

    it('should import a CSV file named after an object method', async () => {
        window.localStorage.clear();
        window.location.hash = '';
        const file = new File(['id,name\n1,Alice\n2,Bob\n'], 'toString.csv', {
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
        userEvents.upload(await screen.findByLabelText('CSV File'), file);
        await screen.findByDisplayValue('toString');
        fireEvent.click(screen.getByText('Import'));
        await screen.findByText('Tostrings', {
            selector: '#react-admin-title *',
        });
        await screen.findByText('1-2 of 2');
    });

    it('should import CSV headers named after an object method', async () => {
        window.localStorage.clear();
        window.location.hash = '';
        const file = new File(
            [
                'id,name,constructor,toString,__proto__\n' +
                    '1,Alice,a,b,c\n' +
                    '2,Bob,d,e,f\n',
            ],
            'people.csv',
            { type: 'text/csv' }
        );
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
        userEvents.upload(await screen.findByLabelText('CSV File'), file);
        await screen.findByDisplayValue('people');
        fireEvent.click(screen.getByText('Import'));
        await screen.findByText('People', {
            selector: '#react-admin-title *',
        });
        await screen.findByText('1-2 of 2');
        await screen.findByText('Alice');
    });
});
