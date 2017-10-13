import assert from 'assert';
import linkToRecord from './linkToRecord';

describe('Linking to a record', () => {
    it('should generate valid links', () => {
        assert.equal(linkToRecord('books', 22), 'books/22');
        assert.equal(linkToRecord('books', '/books/13'), 'books/%2Fbooks%2F13');
        assert.equal(
            linkToRecord('blogs', 'https://dunglas.fr'),
            'blogs/https%3A%2F%2Fdunglas.fr'
        );
    });
});
