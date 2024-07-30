import { date, name, internet, address } from 'faker/locale/en';

import { randomDate, weightedBoolean } from './utils';

export const generateCustomers = (): Customer[] => {
    // This is the total number of people pictures available. We only use those pictures for actual customers
    const maxCustomers = 223;
    let numberOfCustomers = 0;

    return Array.from(Array(900).keys()).map(id => {
        const first_seen = randomDate();
        const last_seen = randomDate(first_seen);
        const has_ordered =
            weightedBoolean(25) && numberOfCustomers < maxCustomers;
        const first_name = name.firstName();
        const last_name = name.lastName();
        const email = internet.email(first_name, last_name);
        const birthday = has_ordered ? date.past(60) : null;
        const avatar = has_ordered
            ? 'https://marmelab.com/posters/avatar-' +
              numberOfCustomers +
              '.jpeg'
            : undefined;

        if (has_ordered) {
            numberOfCustomers++;
        }

        return {
            id,
            first_name,
            last_name,
            email,
            address: has_ordered ? address.streetAddress() : null,
            zipcode: has_ordered ? address.zipCode() : null,
            city: has_ordered ? address.city() : null,
            stateAbbr: has_ordered ? address.stateAbbr() : null,
            avatar,
            birthday: birthday ? birthday.toISOString() : null,
            first_seen: first_seen.toISOString(),
            last_seen: last_seen.toISOString(),
            has_ordered: has_ordered,
            latest_purchase: null, // finalize
            has_newsletter: has_ordered ? weightedBoolean(30) : true,
            groups: [], // finalize
            nb_orders: 0,
            total_spent: 0,
        };
    });
};

export type Customer = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    zipcode: string;
    city: string;
    stateAbbr: string;
    avatar: string;
    birthday: string | null;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_orders: number;
    total_spent: number;
};
