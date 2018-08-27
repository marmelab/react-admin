import { random, lorem } from 'faker';

import { randomFloat, weightedBoolean } from './utils';

export default db => {
    let id = 0;

    return db.categories.reduce(
        (acc, category) => [
            ...acc,
            ...Array.from(Array(10).keys()).map(index => {
                const width = randomFloat(10, 40);
                const height = randomFloat(10, 40);

                return {
                    id: id++,
                    category_id: category.id,
                    reference:
                        category.name.substr(0, 2) +
                        '-' +
                        random.alphaNumeric(5) +
                        '-' +
                        random.arrayElement('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                    width: width,
                    height: height,
                    price: randomFloat(
                        (width * height) / 20,
                        (width * height) / 15
                    ),
                    thumbnail:
                        'https://marmelab.com/posters/' +
                        category.name +
                        '-' +
                        (index + 1) +
                        '.jpeg',
                    image:
                        'https://marmelab.com/posters/' +
                        category.name +
                        '-' +
                        (index + 1) +
                        '.jpeg',
                    description: lorem.paragraph(),
                    stock: weightedBoolean(20)
                        ? 0
                        : random.number({ min: 0, max: 250 }),
                };
            }),
        ],
        []
    );
};
