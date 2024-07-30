import { random, lorem } from 'faker/locale/en';
import { subDays, isAfter } from 'date-fns';

import { randomDate, weightedArrayElement, weightedBoolean } from './utils';
import type { Db } from './types';

export const generateReviews = (db: Db): Review[] => {
    const today = new Date();
    const aMonthAgo = subDays(today, 30);

    let id = 0;
    const reviewers = db.customers
        .filter(customer => customer.has_ordered)
        .filter(() => weightedBoolean(60)) // only 60% of buyers write reviews
        .map(customer => customer.id);

    return db.orders
        .filter(order => reviewers.indexOf(order.customer_id) !== -1)
        .reduce(
            (acc, order) => [
                ...acc,
                ...order.basket
                    .filter(() => weightedBoolean(40)) // reviewers review 40% of their products
                    .map(product => {
                        const date = randomDate(order.date);
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
                            date: date.toISOString(),
                            status: status,
                            order_id: order.id,
                            product_id: product.product_id,
                            customer_id: order.customer_id,
                            rating: random.number({ min: 1, max: 5 }),
                            comment: Array.apply(
                                null,
                                Array(random.number({ min: 1, max: 5 }))
                            )
                                .map(() => lorem.sentences())
                                .join('\n \r'),
                        };
                    }),
            ],
            []
        );
};

export type Review = {
    id: number;
    date: string;
    status: 'accepted' | 'rejected' | 'pending';
    order_id: number;
    product_id: number;
    customer_id: number;
    rating: number;
    comment: string;
};
