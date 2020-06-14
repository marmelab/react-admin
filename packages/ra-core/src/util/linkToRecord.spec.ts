import expect from 'expect';
import linkToRecord from './linkToRecord';

describe('Linking to a record', () => {
    it('should generate valid edition links by default', () => {
        expect(linkToRecord('books', 22)).toEqual('books/22');
        expect(linkToRecord('books', '/books/13')).toEqual(
            'books/%2Fbooks%2F13'
        );
        expect(linkToRecord('blogs', 'https://dunglas.fr')).toEqual(
            'blogs/https%3A%2F%2Fdunglas.fr'
        );
    });
    it('should generate valid show links if requested', () => {
        expect(linkToRecord('books', 22, 'show')).toEqual('books/22/show');
        expect(linkToRecord('books', '/books/13', 'show')).toEqual(
            'books/%2Fbooks%2F13/show'
        );
        expect(linkToRecord('blogs', 'https://dunglas.fr', 'show')).toEqual(
            'blogs/https%3A%2F%2Fdunglas.fr/show'
        );
    });
});
