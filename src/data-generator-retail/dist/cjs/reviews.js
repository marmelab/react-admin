"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReviews = void 0;
var en_1 = require("faker/locale/en");
var date_fns_1 = require("date-fns");
var utils_1 = require("./utils");
var generateReviews = function (db) {
    var today = new Date();
    var aMonthAgo = (0, date_fns_1.subDays)(today, 30);
    var id = 0;
    var reviewers = db.customers
        .filter(function (customer) { return customer.has_ordered; })
        .filter(function () { return (0, utils_1.weightedBoolean)(60); }) // only 60% of buyers write reviews
        .map(function (customer) { return customer.id; });
    return db.orders
        .filter(function (order) { return reviewers.indexOf(order.customer_id) !== -1; })
        .reduce(function (acc, order) { return __spreadArray(__spreadArray([], acc, true), order.basket
        .filter(function () { return (0, utils_1.weightedBoolean)(40); }) // reviewers review 40% of their products
        .map(function (product) {
        var date = (0, utils_1.randomDate)(order.date);
        var status = (0, date_fns_1.isAfter)(aMonthAgo, date)
            ? (0, utils_1.weightedArrayElement)(['accepted', 'rejected'], [3, 1])
            : (0, utils_1.weightedArrayElement)(['pending', 'accepted', 'rejected'], [5, 3, 1]);
        return {
            id: id++,
            date: date.toISOString(),
            status: status,
            order_id: order.id,
            product_id: product.product_id,
            customer_id: order.customer_id,
            rating: en_1.random.number({ min: 1, max: 5 }),
            comment: Array.apply(null, Array(en_1.random.number({ min: 1, max: 5 })))
                .map(function () { return en_1.lorem.sentences(); })
                .join('\n \r'),
        };
    }), true); }, []);
};
exports.generateReviews = generateReviews;
//# sourceMappingURL=reviews.js.map