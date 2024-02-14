import fakeRestDataProvider from 'ra-data-fakerest';

export const data = {
    books: [
        {
            id: 1,
            title: {
                en: 'War and Peace',
                fr: 'Guerre et Paix',
            },
            authors: [
                {
                    name: 'Leo Tolstoy',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1869,
            time: '2024-02-12T13:45:29.170Z',
            genre: [1, 2],
            published: true,
        },
        {
            id: 2,
            title: {
                en: 'Pride and Predjudice',
                fr: 'Orgueil et préjugés',
            },
            authors: [
                {
                    name: 'Jane Austen',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'F',
            year: 1813,
            time: '2024-02-12T13:45:29.170Z',
            genre: [3, 4],
            published: true,
        },
        {
            id: 3,
            title: {
                en: 'The Picture of Dorian Gray',
                fr: 'La photo de Dorian Gray',
            },
            authors: [
                {
                    name: 'Oscar Wilde',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1890,
            time: '2024-02-12T13:45:29.170Z',
            genre: [5, 6],
            published: true,
        },
        {
            id: 4,
            title: {
                en: 'The little Prince',
                fr: 'Le Petit Prince',
            },
            authors: [
                {
                    name: 'Antoine de Saint-Exupéry',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1943,
            time: '2024-02-12T13:45:29.170Z',
            genre: [7, 8],
            published: true,
        },
        {
            id: 5,
            title: {
                en: "Alice's Adventures in Wonderland",
                fr: "Les aventures d'Alice au Pays des Merveilles",
            },
            authors: [
                {
                    name: 'Lewis Carroll',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1865,
            time: '2024-02-12T13:45:29.170Z',
            genre: [8, 9],
            published: true,
        },
        {
            id: 6,
            title: {
                en: 'Madame Bovary',
                fr: 'Madame Bovary',
            },
            authors: [
                {
                    name: 'Gustave Flaubert',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1856,
            time: '2024-02-12T13:45:29.170Z',
            genre: [10, 11],
            published: true,
        },
        {
            id: 7,
            title: {
                en: 'The Lord of the Rings',
                fr: 'Le Seigneur des Anneaux',
            },
            authors: [
                {
                    name: 'J. R. R. Tolkien',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'F',
            year: 1954,
            time: '2024-02-12T13:45:29.170Z',
            genre: [7, 8],
            published: true,
        },
        {
            id: 8,
            title: {
                en: "Harry Potter and the Philosopher's Stone",
                fr: 'Harry Potter et la pierre philosophale',
            },
            authors: [
                {
                    name: 'J. K. Rowling',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'F',
            year: 1997,
            time: '2024-02-12T13:45:29.170Z',
            genre: [7, 8],
            published: true,
        },
        {
            id: 9,
            title: {
                en: 'The Alchemist',
                fr: "L'alchimiste",
            },
            authors: [
                {
                    name: 'Paulo Coelho',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1988,
            time: '2024-02-12T13:45:29.170Z',
            genre: [12, 13],
            published: true,
        },
        {
            id: 10,
            title: {
                en: 'A Catcher in the Rye',
                fr: 'Un receveur dans le seigle',
            },
            authors: [
                {
                    name: 'J. D. Salinger',
                    role: 'head_writer',
                },
                {
                    name: 'Alexander Pushkin',
                    role: 'co_writer',
                },
            ],
            author_gender: 'M',
            year: 1951,
            time: '2024-02-12T13:45:29.170Z',
            genre: [14, 15],
            published: true,
        },
    ],
    genres: [
        { id: 1, name: 'Historical Fiction' },
        { id: 2, name: 'War' },
        { id: 3, name: 'Classic' },
        { id: 4, name: 'Romance' },
        { id: 5, name: 'Gothic' },
        { id: 6, name: 'Philosophical' },
        { id: 7, name: 'Fable' },
        { id: 8, name: 'Fantasy' },
        { id: 9, name: 'Adventure' },
        { id: 10, name: 'Literary Realism' },
        { id: 11, name: 'Tragedy' },
        { id: 12, name: 'Philosophical' },
        { id: 13, name: 'Adventure' },
        { id: 14, name: 'Coming-of-age' },
        { id: 15, name: 'Literary Fiction' },
    ],
    authors: [],
};

export const dataProvider = fakeRestDataProvider(data, true);
