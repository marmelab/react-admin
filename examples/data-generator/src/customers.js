import { date, name, internet, address } from 'faker/locale/en';

import { randomDate, weightedBoolean } from './utils';

export default () =>
    Array.from(Array(900).keys()).map(id => {
        const first_seen = randomDate();
        const last_seen = randomDate(first_seen);
        const has_ordered = weightedBoolean(25);
        const first_name = name.firstName();
        const last_name = name.lastName();
        const email = internet.email(first_name, last_name);
        return {
            id,
            first_name,
            last_name,
            email,
            address: has_ordered ? address.streetName() : null,
            zipcode: has_ordered ? address.zipCode() : null,
            city: has_ordered ? address.city() : null,
            avatar: internet.avatar(),
            birthday: has_ordered
                ? date.past(60) - 15 * 365 * 24 * 3600 * 1000
                : null,
            first_seen: first_seen,
            last_seen: last_seen,
            has_ordered: has_ordered,
            latest_purchase: null, // finalize
            has_newsletter: has_ordered ? weightedBoolean(30) : true,
            groups: [], // finalize
            nb_commands: 0,
            total_spent: 0,
        };
    });
