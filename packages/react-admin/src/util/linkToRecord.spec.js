import assert from 'assert';
import linkToRecord from './linkToRecord';

describe('Linking to a record', () => {
    it('should generate valid edition links by default', () => {
        assert.equal(linkToRecord('books', 22), 'books/22');
        assert.equal(linkToRecord('books', '/books/13'), 'books/%2Fbooks%2F13');
        assert.equal(
            linkToRecord('blogs', 'https://dunglas.fr'),
            'blogs/https%3A%2F%2Fdunglas.fr'
        );
    });
    it('should generate valid show links if requested', () => {
        assert.equal(linkToRecord('books', 22, 'show'), 'books/22/show');
        assert.equal(
            linkToRecord('books', '/books/13', 'show'),
            'books/%2Fbooks%2F13/show'
        );
        assert.equal(
            linkToRecord('blogs', 'https://dunglas.fr', 'show'),
            'blogs/https%3A%2F%2Fdunglas.fr/show'
        );
    });
});
