import md5 from 'md5';

export default (db, chance, randomDate) =>
    Array.from(Array(900).keys()).map(id => {
        const first_seen = randomDate();
        const last_seen = randomDate(first_seen);
        const has_ordered = chance.bool({ likelihood: 25 });
        const email = chance.email();

        return {
            id,
            first_name: chance.first(),
            last_name: chance.last(),
            email: email,
            address: has_ordered ? chance.address() : null,
            zipcode: has_ordered ? chance.zip() : null,
            city: has_ordered ? chance.city() : null,
            avatar: 'https://robohash.org/' + md5(email) + '.png',
            birthday: has_ordered ? chance.birthday() : null,
            first_seen: first_seen,
            last_seen: last_seen,
            has_ordered: has_ordered,
            latest_purchase: null, // finalize
            has_newsletter: has_ordered
                ? chance.bool({ likelihood: 30 })
                : true,
            groups: [], // finalize
            nb_commands: 0,
            total_spent: 0,
        };
    });
