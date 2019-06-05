import { date, name, internet, address } from 'faker/locale/en';

import { randomDate, weightedBoolean } from './utils';

export default (db, { serializeDate }) =>
    Array.from(Array(900).keys()).map(id => {
        const first_seen = randomDate();
        const last_seen = randomDate(first_seen);
        const has_ordered = weightedBoolean(25);
        const first_name = name.firstName();
        const last_name = name.lastName();
        const email = internet.email(first_name, last_name);
        const birthday = has_ordered ? date.past(60) : null;
        return {
            id,
            first_name,
            last_name,
            email,
            address: has_ordered ? address.streetName() : null,
            zipcode: has_ordered ? address.zipCode() : null,
            city: has_ordered ? address.city() : null,
            avatar: internet.avatar(),
            birthday: serializeDate && birthday ? birthday.toISOString() : birthday,
            first_seen: serializeDate ? first_seen.toISOString() : first_seen,
            last_seen: serializeDate ? last_seen.toISOString() : last_seen,
            has_ordered: has_ordered,
            latest_purchase: null, // finalize
            has_newsletter: has_ordered ? weightedBoolean(30) : true,
            groups: [], // finalize
            nb_commands: 0,
            total_spent: 0,
        };
    });
