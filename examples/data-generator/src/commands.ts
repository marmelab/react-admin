import { random } from 'faker/locale/en';
import { isAfter, subDays } from 'date-fns';

import {
    randomDate,
    randomFloat,
    weightedArrayElement,
    weightedBoolean,
} from './utils';

export default (db, { serializeDate }) => {
    const today = new Date();
    const aMonthAgo = subDays(today, 30);
    const realCustomers = db.customers.filter(customer => customer.has_ordered);

    return Array.from(Array(600).keys()).map(id => {
        const nbProducts = weightedArrayElement(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [30, 20, 5, 2, 1, 1, 1, 1, 1, 1]
        );
        const basket = Array.from(Array(nbProducts).keys()).map(() => ({
            product_id: random.number({ min: 0, max: 10 * 13 - 1 }),
            quantity: weightedArrayElement(
                [1, 2, 3, 4, 5],
                [10, 5, 3, 2, 1]
            ) as number,
        }));

        const total_ex_taxes = basket.reduce(
            (total, product) =>
                total +
                db.products[product.product_id].price * product.quantity,
            0
        );

        const delivery_fees = randomFloat(3, 8);
        const tax_rate = random.arrayElement([0.12, 0.17, 0.2]);
        const taxes = parseFloat(
            ((total_ex_taxes + delivery_fees) * tax_rate).toFixed(2)
        );
        const customer = random.arrayElement<any>(realCustomers);
        const date = randomDate(customer.first_seen, customer.last_seen);

        const status =
            isAfter(date, aMonthAgo) && random.boolean()
                ? 'ordered'
                : weightedArrayElement(['delivered', 'cancelled'], [10, 1]);
        return {
            id,
            reference: random.alphaNumeric(6).toUpperCase(),
            date: serializeDate ? date.toISOString() : date,
            customer_id: customer.id,
            basket: basket,
            total_ex_taxes: total_ex_taxes,
            delivery_fees: delivery_fees,
            tax_rate: tax_rate,
            taxes: taxes,
            total: parseFloat(
                (total_ex_taxes + delivery_fees + taxes).toFixed(2)
            ),
            status: status,
            returned: status === 'delivered' ? weightedBoolean(10) : false,
        };
    });
};
