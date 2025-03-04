"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function default_1(db) {
    // set latest purchase date
    db.orders.forEach(function (order) {
        var customer = db.customers[order.customer_id];
        if (!customer.latest_purchase ||
            customer.latest_purchase < order.date) {
            customer.latest_purchase = order.date;
        }
        customer.total_spent += order.total;
        customer.nb_orders++;
    });
    // set product sales
    db.orders.forEach(function (order) {
        order.basket.forEach(function (item) {
            db.products[item.product_id].sales += item.quantity;
        });
    });
    // add 'collector' group
    var customersBySpending = db.orders.reduce(function (customers, order) {
        if (!customers[order.customer_id]) {
            customers[order.customer_id] = { nbProducts: 0 };
        }
        customers[order.customer_id].nbProducts += order.basket.length;
        return customers;
    }, {});
    Object.keys(customersBySpending).forEach(function (customer_id) {
        if (customersBySpending[customer_id].nbProducts > 10) {
            db.customers[customer_id].groups.push('collector');
        }
    });
    // add 'ordered_once' group
    db.customers
        .filter(function (customer) { return customer.nb_orders === 1; })
        .forEach(function (customer) { return customer.groups.push('ordered_once'); });
    // add 'compulsive' group
    db.customers
        .filter(function (customer) { return customer.total_spent > 1500; })
        .forEach(function (customer) { return customer.groups.push('compulsive'); });
    // add 'regular' group
    db.customers
        .filter(function () { return (0, utils_1.weightedBoolean)(20); })
        .forEach(function (customer) { return customer.groups.push('regular'); });
    // add 'returns' group
    db.orders
        .filter(function (order) { return order.returned; })
        .forEach(function (order) {
        if (db.customers[order.customer_id].groups.indexOf('returns') === -1) {
            db.customers[order.customer_id].groups.push('returns');
        }
    });
    // add 'reviewer' group
    db.reviews.forEach(function (review) {
        var customer = db.customers[review.customer_id];
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
exports.default = default_1;
//# sourceMappingURL=finalize.js.map