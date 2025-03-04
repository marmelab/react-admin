"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProducts = void 0;
var en_1 = require("faker/locale/en");
var utils_1 = require("./utils");
var productReferences = {
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
var generateProducts = function (db) {
    var id = 0;
    return db.categories.reduce(function (acc, category) { return __spreadArray(__spreadArray([], acc, true), Array.from(Array(10).keys()).map(function (index) {
        var width = (0, utils_1.randomFloat)(10, 40);
        var height = (0, utils_1.randomFloat)(10, 40);
        return {
            id: id++,
            category_id: category.id,
            reference: productReferences[category.name][index],
            width: width,
            height: height,
            price: (0, utils_1.randomFloat)((width * height) / 20, (width * height) / 15),
            thumbnail: 'https://marmelab.com/posters/' +
                category.name +
                '-' +
                (index + 1) +
                '.jpeg',
            image: 'https://marmelab.com/posters/' +
                category.name +
                '-' +
                (index + 1) +
                '.jpeg',
            description: en_1.lorem.paragraph(),
            stock: (0, utils_1.weightedBoolean)(10)
                ? 0
                : en_1.random.number({ min: 0, max: 150 }),
            sales: 0,
        };
    }), true); }, []);
};
exports.generateProducts = generateProducts;
//# sourceMappingURL=products.js.map