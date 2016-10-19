#!/usr/bin/env node
const faker = require('faker');

const random = max => Math.floor(Math.random() * max) + 1;

const posts = [...Array(15).keys()].map(id => ({
    id,
    title: faker.hacker.phrase(),
    teaser: faker.lorem.paragraphs(1),
    body: `<p>${faker.lorem.paragraphs(5).split('\n \r').join('</p><p>')}</p>`,
    views: random(1000),
    average_note: random(5) + (random(5) * 0.1),
    published_at: faker.date.past(),
    tags: new Set([...Array(random(3)).keys()].map(faker.hacker.abbreviation)),
    category: faker.hacker.noun(),
    backlinks: [...Array(random(2)).keys()].map(() => ({
        date: faker.date.past(),
        url: faker.internet.url(),
    })),
}));

const commentAuthor = () => {
    if (!faker.random.boolean()) {
        return null;
    }

    const generatedAuthor = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };

    if (faker.random.boolean()) {
        generatedAuthor.email = faker.internet.email();
    }

    return generatedAuthor;
};

const comments = [...Array(23).keys()].map(() => ({
    id: faker.random.uuid(),
    author: commentAuthor(),
    post_id: random(posts.length),
    body: [...Array(random(3)).keys()].map(faker.hacker.phrase).join(' '),
    created_at: faker.date.past(),
}));

console.log(JSON.stringify({
    posts,
    comments,
}, null, 4));
