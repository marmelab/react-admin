import { internet, name } from 'faker/locale/en_US';

import { Db } from './types';

export const generateSales = (_: Db) => {
    const randomSales = Array.from(Array(10).keys()).map(id => {
        const first_name = name.firstName();
        const last_name = name.lastName();
        const email = internet.email(first_name, last_name);

        return {
            id: id + 1,
            first_name,
            last_name,
            email,
            password: 'demo',
            administrator: false,
        };
    });
    return [
        {
            id: 0,
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@atomic.dev',
            password: 'demo',
            administrator: true,
        },
        ...randomSales,
    ];
};
