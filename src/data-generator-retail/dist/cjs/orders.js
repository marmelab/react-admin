"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrders = void 0;
var en_1 = require("faker/locale/en");
var date_fns_1 = require("date-fns");
var utils_1 = require("./utils");
var generateOrders = function (db) {
    var today = new Date();
    var aMonthAgo = (0, date_fns_1.subDays)(today, 30);
    var realCustomers = db.customers.filter(function (customer) { return customer.has_ordered; });
    return Array.from(Array(600).keys()).map(function (id) {
        var nbProducts = (0, utils_1.weightedArrayElement)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [30, 20, 5, 2, 1, 1, 1, 1, 1, 1]);
        var productIds = new Set();
        var basket = Array.from(Array(nbProducts).keys()).map(function () {
            var product_id;
            do {
                product_id = en_1.random.number({
                    min: 0,
                    max: 10 * 13 - 1,
                });
            } while (productIds.has(product_id));
            productIds.add(product_id);
            return {
                product_id: product_id,
                quantity: (0, utils_1.weightedArrayElement)([1, 2, 3, 4, 5], [10, 5, 3, 2, 1]),
            };
        });
        var total_ex_taxes = basket.reduce(function (total, product) {
            return total +
                db.products[product.product_id].price * product.quantity;
        }, 0);
        var delivery_fees = (0, utils_1.randomFloat)(3, 8);
        var tax_rate = en_1.random.arrayElement([0.12, 0.17, 0.2]);
        var taxes = parseFloat(((total_ex_taxes + delivery_fees) * tax_rate).toFixed(2));
        var customer = en_1.random.arrayElement(realCustomers);
        var date = (0, utils_1.randomDate)(customer.first_seen, customer.last_seen);
        var status = (0, date_fns_1.isAfter)(date, aMonthAgo) && en_1.random.boolean()
            ? 'ordered'
            : (0, utils_1.weightedArrayElement)(['delivered', 'cancelled'], [10, 1]);
        return {
            id: id,
            reference: en_1.random.alphaNumeric(6).toUpperCase(),
            date: date.toISOString(),
            customer_id: customer.id,
            basket: basket,
            total_ex_taxes: total_ex_taxes,
            delivery_fees: delivery_fees,
            tax_rate: tax_rate,
            taxes: taxes,
            total: parseFloat((total_ex_taxes + delivery_fees + taxes).toFixed(2)),
            status: status,
            returned: status === 'delivered' ? (0, utils_1.weightedBoolean)(10) : false,
        };
    });
};
exports.generateOrders = generateOrders;
//# sourceMappingURL=orders.js.map