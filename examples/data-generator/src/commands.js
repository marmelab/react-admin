import isAfter from 'date-fns/is_after';
import subDays from 'date-fns/sub_days';

export default (db, chance, randomDate) => {
    const today = new Date();
    const aMonthAgo = subDays(today, 30);

    return Array.from(Array(600).keys()).map(id => {
        const nbProducts = chance.weighted(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [30, 20, 5, 2, 1, 1, 1, 1, 1, 1]
        );
        const basket = Array.from(Array(nbProducts).keys()).map(() => ({
            product_id: chance.integer({ min: 0, max: 10 * 13 - 1 }),
            quantity: chance.weighted([1, 2, 3, 4, 5], [10, 5, 3, 2, 1]),
        }));

        const total_ex_taxes = basket.reduce((total, product) => {
            return (
                total + db.products[product.product_id].price * product.quantity
            );
        }, 0);

        const delivery_fees = chance.floating({ min: 3, max: 8, fixed: 2 });
        const tax_rate = chance.pick([0.12, 0.17, 0.2]);
        const taxes = parseFloat(
            ((total_ex_taxes + delivery_fees) * tax_rate).toFixed(2)
        );
        const customer = chance.pick(
            db.customers.filter(customer => customer.has_ordered)
        );
        const date = randomDate(customer.first_seen, customer.last_seen);

        const status =
            isAfter(date, aMonthAgo) && chance.bool()
                ? 'ordered'
                : chance.weighted(['delivered', 'cancelled'], [10, 1]);
        return {
            id,
            reference: chance.string({
                length: 6,
                pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
            }),
            date: date,
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
            returned:
                status == 'delivered' ? chance.bool({ likelihood: 10 }) : false,
        };
    });
};
