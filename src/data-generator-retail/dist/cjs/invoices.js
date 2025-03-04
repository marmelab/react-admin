"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoices = void 0;
var generateInvoices = function (db) {
    var id = 0;
    return (db.orders
        .filter(function (order) { return order.status !== 'delivered'; })
        // @ts-ignore
        .sort(function (a, b) { return new Date(a.date) - new Date(b.date); })
        .map(function (order) { return ({
        id: id++,
        date: order.date,
        order_id: order.id,
        customer_id: order.customer_id,
        total_ex_taxes: order.total_ex_taxes,
        delivery_fees: order.delivery_fees,
        tax_rate: order.tax_rate,
        taxes: order.taxes,
        total: order.total,
    }); }));
};
exports.generateInvoices = generateInvoices;
//# sourceMappingURL=invoices.js.map