import { Db } from './types';
import { weightedBoolean } from './utils';

export default function (db: Db) {
    // set latest purchase date
    db.orders.forEach(order => {
        let customer = db.customers[order.customer_id];
        if (
            !customer.latest_purchase ||
            customer.latest_purchase < order.date
        ) {
            customer.latest_purchase = order.date;
        }
        customer.total_spent += order.total;
        customer.nb_orders++;
    });

    // set product sales
    db.orders.forEach(order => {
        order.basket.forEach(item => {
            db.products[item.product_id].sales += item.quantity;
        });
    });

    // add 'collector' group
    const customersBySpending = db.orders.reduce((customers, order) => {
        if (!customers[order.customer_id]) {
            customers[order.customer_id] = { nbProducts: 0 };
        }
        customers[order.customer_id].nbProducts += order.basket.length;
        return customers;
    }, {});
    Object.keys(customersBySpending).forEach(customer_id => {
        if (customersBySpending[customer_id].nbProducts > 10) {
            db.customers[customer_id].groups.push('collector');
        }
    });

    // add 'ordered_once' group
    db.customers
        .filter(customer => customer.nb_orders === 1)
        .forEach(customer => customer.groups.push('ordered_once'));

    // add 'compulsive' group
    db.customers
        .filter(customer => customer.total_spent > 1500)
        .forEach(customer => customer.groups.push('compulsive'));

    // add 'regular' group
    db.customers
        .filter(() => weightedBoolean(20))
        .forEach(customer => customer.groups.push('regular'));

    // add 'returns' group
    db.orders
        .filter(order => order.returned)
        .forEach(order => {
            if (
                db.customers[order.customer_id].groups.indexOf('returns') === -1
            ) {
                db.customers[order.customer_id].groups.push('returns');
            }
        });

    // add 'reviewer' group
    db.reviews.forEach(review => {
        let customer = db.customers[review.customer_id];
        if (customer.groups.indexOf('reviewer') === -1) {
            customer.groups.push('reviewer');
        }
    });

    // add settings
    db.settings = [
        {
            id: 1,
            configuration: {
                url: 'http://posters-galore.com/',
                mail: {
                    sender: 'julio@posters-galore.com',
                    transport: {
                        service: 'fakemail',
                        auth: {
                            user: 'fake@mail.com',
                            pass: 'f00b@r',
                        },
                    },
                },
                file_type_whiltelist: [
                    'txt',
                    'doc',
                    'docx',
                    'xls',
                    'xlsx',
                    'pdf',
                    'png',
                    'jpg',
                ],
            },
        },
    ];
}

export type Settings = {
    id: number;
    configuration: {
        url: string;
        mail: {
            sender: string;
            transport: {
                service: string;
                auth: {
                    user: string;
                    pass: string;
                };
            };
        };
        file_type_whiltelist: string[];
    };
}[];
