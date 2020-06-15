import expect from 'expect';
import resolveRedirectTo from './resolveRedirectTo';

describe('resolveRedirectTo', () => {
    it('should accept a view name', () => {
        expect(resolveRedirectTo('list', '/books', 1)).toEqual('/books');
        expect(resolveRedirectTo('create', '/books', 1)).toEqual(
            '/books/create'
        );
        expect(resolveRedirectTo('edit', '/books', 1)).toEqual('/books/1');
        expect(resolveRedirectTo('show', '/books', 1)).toEqual('/books/1/show');
    });

    it('should accept a custom route name', () => {
        expect(resolveRedirectTo('home', 'books', 1)).toEqual('home');
    });

    it('should accept a function as parameter', () => {
        const redirect = (basePath, id, data) =>
            `/related/${data.related_id}/show`;
        expect(
            resolveRedirectTo(redirect, 'books', 1, { related_id: 3 })
        ).toEqual('/related/3/show');
    });
});
