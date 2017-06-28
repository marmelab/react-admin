import assert from 'assert';
import resolveRedirectTo from './resolveRedirectTo';

describe('resolve redirect to', () => {
    it('should generate expected links', () => {
        assert.equal(resolveRedirectTo('list', 'books', 1), 'books');
        assert.equal(resolveRedirectTo('create', 'books', 1), 'books/create');
        assert.equal(resolveRedirectTo('edit', 'books', 1), 'books/1');
        assert.equal(resolveRedirectTo('show', 'books', 1), 'books/1/show');
        assert.equal(resolveRedirectTo('home', 'books', 1), 'home');
    });
});
