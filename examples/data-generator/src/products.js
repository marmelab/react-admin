export default (db, chance) => {
    let id = 0;

    return db.categories.reduce(
        (acc, category) => [
            ...acc,
            ...Array.from(Array(10).keys()).map(index => {
                const width = chance.floating({ min: 10, max: 40, fixed: 2 });
                const height = chance.floating({ min: 10, max: 40, fixed: 2 });

                return {
                    id: id++,
                    category_id: category.id,
                    reference:
                        category.name.substr(0, 2) +
                        '-' +
                        chance.string({
                            length: 5,
                            pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
                        }) +
                        '-' +
                        chance.string({
                            length: 1,
                            pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                        }),
                    width: width,
                    height: height,
                    price: chance.floating({
                        min: width * height / 20,
                        max: width * height / 15,
                        fixed: 2,
                    }),
                    thumbnail:
                        'https://lorempixel.com/' +
                        (width * 10).toFixed() +
                        '/' +
                        (height * 10).toFixed() +
                        '/' +
                        category.name +
                        '/' +
                        index,
                    image:
                        'https://lorempixel.com/' +
                        (width * 50).toFixed() +
                        '/' +
                        (height * 50).toFixed() +
                        '/' +
                        category.name +
                        '/' +
                        index,
                    description: chance.paragraph(),
                    stock: chance.bool({ likelihood: 20 })
                        ? 0
                        : chance.integer({ min: 0, max: 250 }),
                };
            }),
        ],
        []
    );
};
