import { random, lorem } from 'faker';
import subDays from 'date-fns/sub_days';
import isAfter from 'date-fns/is_after';

import { randomDate, weightedArrayElement, weightedBoolean } from './utils';

export default db => {
    const today = new Date();
    const aMonthAgo = subDays(today, 30);

    let id = 0;
    const reviewers = db.customers
        .filter(customer => customer.has_ordered)
        .filter(() => weightedBoolean(60)) // only 60% of buyers write reviews
        .map(customer => customer.id);

    return db.commands
        .filter(command => reviewers.indexOf(command.customer_id) !== -1)
        .reduce(
            (acc, command) => [
                ...acc,
                ...command.basket
                    .filter(() => weightedBoolean(40)) // reviewers review 40% of their products
                    .map(product => {
                        const date = randomDate(command.date);
                        const status = isAfter(aMonthAgo, date)
                            ? weightedArrayElement(
                                  ['accepted', 'rejected'],
                                  [3, 1]
                              )
                            : weightedArrayElement(
                                  ['pending', 'accepted', 'rejected'],
                                  [5, 3, 1]
                              );

                        return {
                            id: id++,
                            date: date,
                            status: status,
                            command_id: command.id,
                            product_id: product.product_id,
                            customer_id: command.customer_id,
                            rating: random.number({ min: 1, max: 5 }),
                            comment: lorem.paragraph(),
                        };
                    }),
            ],
            []
        );
};
