import { Db } from './types';

// --champagne-pink: #eddcd2ff;
// --linen: #fff1e6ff;
// --pale-pink: #fde2e4ff;
// --mimi-pink: #fad2e1ff;
// --powder-blue: #c5deddff;
// --mint-cream: #dbe7e4ff;
// --isabelline: #f0efebff;
// --alice-blue: #d6e2e9ff;
// --beau-blue: #bcd4e6ff;
// --pale-cerulean: #99c1deff;

const tags = [
    { id: 0, name: 'football-fan', color: '#eddcd2' },
    { id: 1, name: 'holiday-card', color: '#fff1e6' },
    { id: 2, name: 'influencer', color: '#fde2e4' },
    { id: 3, name: 'manager', color: '#fad2e1' },
    { id: 4, name: 'musician', color: '#c5dedd' },
    { id: 5, name: 'vip', color: '#dbe7e4' },
];

export const generateTags = (db: Db) => {
    return [...tags];
};
