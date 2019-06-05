import assert from 'assert';
import resolveRedirectTo from './resolveRedirectTo';

describe('resolveRedirectTo', () => {
    it('should accept a view name', () => {
        assert.equal(resolveRedirectTo('list', '/books', 1), '/books');
        assert.equal(resolveRedirectTo('create', '/books', 1), '/books/create');
        assert.equal(resolveRedirectTo('edit', '/books', 1), '/books/1');
        assert.equal(resolveRedirectTo('show', '/books', 1), '/books/1/show');
    });

    it('should accept a custom route name', () => {
        assert.equal(resolveRedirectTo('home', 'books', 1), 'home');
    });

    it('should accept a function as parameter', () => {
        const redirect = (basePath, id, data) => `/related/${data.related_id}/show`;
        assert.equal(resolveRedirectTo(redirect, 'books', 1, { related_id: 3 }), '/related/3/show');
    });
});
