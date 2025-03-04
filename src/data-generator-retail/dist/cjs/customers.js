"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCustomers = void 0;
var en_1 = require("faker/locale/en");
var utils_1 = require("./utils");
var generateCustomers = function () {
    // This is the total number of people pictures available. We only use those pictures for actual customers
    var maxCustomers = 223;
    var numberOfCustomers = 0;
    return Array.from(Array(900).keys()).map(function (id) {
        var first_seen = (0, utils_1.randomDate)();
        var last_seen = (0, utils_1.randomDate)(first_seen);
        var has_ordered = (0, utils_1.weightedBoolean)(25) && numberOfCustomers < maxCustomers;
        var first_name = en_1.name.firstName();
        var last_name = en_1.name.lastName();
        var email = en_1.internet.email(first_name, last_name);
        var birthday = has_ordered ? en_1.date.past(60) : null;
        var avatar = has_ordered
            ? 'https://marmelab.com/posters/avatar-' +
                numberOfCustomers +
                '.jpeg'
            : undefined;
        if (has_ordered) {
            numberOfCustomers++;
        }
        return {
            id: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            address: has_ordered ? en_1.address.streetAddress() : null,
            zipcode: has_ordered ? en_1.address.zipCode() : null,
            city: has_ordered ? en_1.address.city() : null,
            stateAbbr: has_ordered ? en_1.address.stateAbbr() : null,
            avatar: avatar,
            birthday: birthday ? birthday.toISOString() : null,
            first_seen: first_seen.toISOString(),
            last_seen: last_seen.toISOString(),
            has_ordered: has_ordered,
            latest_purchase: null,
            has_newsletter: has_ordered ? (0, utils_1.weightedBoolean)(30) : true,
            groups: [],
            nb_orders: 0,
            total_spent: 0,
        };
    });
};
exports.generateCustomers = generateCustomers;
//# sourceMappingURL=customers.js.map