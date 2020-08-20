import { random, lorem } from 'faker/locale/en';

import { randomFloat, weightedBoolean } from './utils';

const productReferences = {
    animals: [
        'Cat Nose',
        'Dog Grass',
        'Brown Cow',
        'Leopard Road',
        'Sad Dog',
        'Pelican Pier',
        'Green Birds',
        'Concrete Seaguls',
        'Hiding Seagul',
        'Sand Caravan',
    ],
    beard: [
        'Black Auburn',
        'Basket Beard',
        'Handlebar Moustache',
        'White Beard',
        'Sailor Man',
        'Natural Beard',
        'Yeard Phone',
        'Braid Beard',
        'Terminal Black',
        'Short Boxed',
    ],
    business: [
        'Corporate Prop',
        'Office Chairs',
        'White Clock',
        'Work Suit',
        'Suit & Tie',
        'Shake Hands',
        'Building Sky',
        'Yellow Pad',
        'Work Devices',
        'Hands Clap',
        'Work Meeting',
    ],
    cars: [
        'Old Combi',
        'Asian Plates',
        'Pedestrian Crossing',
        'Farmer Boy',
        'Make Over',
        'Sports Sunset',
        'Desert Jeep',
        'Highway Bridge',
        'Race Stickers',
        'White Deluxe',
    ],
    city: [
        'Bridge Lights',
        'Color Dots',
        'Cloud Suspension',
        'Paved Street',
        'Blue Bay',
        'Wooden Door',
        'Concrete Angles',
        'London Lights',
        'Fort Point',
        'Rainy Glass',
    ],
    flowers: [
        'Apricot Tree',
        'Orange Rose',
        'Purple Petunia',
        'Water Lily',
        'White Peony',
        'Poppy Field',
        'Blue Flax',
        'Love Roses',
        'California Poppy',
        'Dalhia Colors',
    ],
    food: [
        'Fuzzy Forks',
        'Stamp Mug',
        'Two Expressos',
        'Red Latte',
        'Black Grapes',
        'Forgotten Strawberries',
        'Close Steam',
        'Brewing Tea',
        'Red Onions',
        'Dark Honey',
    ],
    nature: [
        'Distant Mountains',
        'Fog Pond',
        'Sand Rocks',
        'Pebble Shore',
        'Eroded Fractals',
        'Water Fall',
        'Drif Wood',
        'Dirt Track',
        'Green Grass',
        'Yellow Lichen',
    ],
    people: [
        'Crossing Alone',
        'Budding Grove',
        'Light Hair',
        'Black & White',
        'Rock Concert',
        'Meeting Bench',
        'Son & Lumière',
        'Running Boy',
        'Dining Hall',
        'Tunnel People',
    ],
    sports: [
        'Feather Ball',
        'Wall Skate',
        'Kick Flip',
        'Down Hill',
        'Baseball Night',
        'Touch Line',
        'Alone Jogger',
        'Green Basket',
        'Mud Hug',
        'Metal Cycle',
    ],
    tech: [
        'Black Screen',
        'Phone Call',
        'Tablet & Phone',
        'No Battery',
        'Phone Book',
        'Camera Parts',
        'Fuzzy Phone',
        'Music & Light',
        'Eye Rest',
        'Aligned Parts',
    ],
    travel: [
        'Distant Jet',
        'Foggy Beach',
        'White Lime',
        'Mysterious Cloud',
        'Mountain Top',
        'Light House',
        'Gray Day',
        'Desert Walkway',
        'Train Track',
        'Plane Trees',
    ],
    water: [
        'Fresh Stream',
        'Reed Line',
        'Mud Tracks',
        'Beach Gazebo',
        'Calm Sea',
        'Early Bath',
        'Aerial Coast',
        'Canal Street',
        'Artificial Beach',
        'Rainy Day',
    ],
};

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
                    reference: productReferences[category.name][index],
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
                    stock: weightedBoolean(10)
                        ? 0
                        : random.number({ min: 0, max: 150 }),
                    sales: 0,
                };
            }),
        ],
        []
    );
};
