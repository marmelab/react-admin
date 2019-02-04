import { weightedBoolean } from './utils';

export default function(db) {
    // set latest purchase date
    db.commands.forEach(command => {
        let customer = db.customers[command.customer_id];
        if (
            !customer.latest_purchase ||
            customer.latest_purchase < command.date
        ) {
            customer.latest_purchase = command.date;
        }
        customer.total_spent += command.total;
        customer.nb_commands++;
    });

    // add 'collector' group
    var customersBySpending = db.commands.reduce((customers, command) => {
        if (!customers[command.customer_id]) {
            customers[command.customer_id] = { nbProducts: 0 };
        }
        customers[command.customer_id].nbProducts += command.basket.length;
        return customers;
    }, {});
    Object.keys(customersBySpending).map(customer_id => {
        if (customersBySpending[customer_id].nbProducts > 10) {
            db.customers[customer_id].groups.push('collector');
        }
    });

    // add 'ordered_once' group
    db.customers
        .filter(customer => customer.nb_commands == 1)
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
    db.commands
        .filter(command => command.returned)
        .forEach(command => {
            if (
                db.customers[command.customer_id].groups.indexOf('returns') ===
                -1
            ) {
                db.customers[command.customer_id].groups.push('returns');
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
