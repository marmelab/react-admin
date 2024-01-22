import expect from 'expect';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

describe('getFieldLabelTranslationArgs', () => {
    it('should return empty span by default', () =>
        expect(getFieldLabelTranslationArgs()).toEqual(['']));

    it('should return the label when given', () => {
        expect(
            getFieldLabelTranslationArgs({
                label: 'foo',
                resource: 'posts',
                source: 'title',
            })
        ).toEqual(['foo', { _: 'foo' }]);
    });

    it('should return the source and resource as translate key', () => {
        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title',
            })
        ).toEqual([`resources.posts.fields.title`, { _: 'Title' }]);
    });

    it('should return the humanized source when given', () => {
        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title',
            })
        ).toEqual([`resources.posts.fields.title`, { _: 'Title' }]);

        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title_with_underscore',
            })
        ).toEqual([
            'resources.posts.fields.title_with_underscore',
            { _: 'Title with underscore' },
        ]);

        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title.with.dots',
            })
        ).toEqual([
            'resources.posts.fields.title.with.dots',
            { _: 'Title with dots' },
        ]);

        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'titleWithCamelCase',
            })
        ).toEqual([
            'resources.posts.fields.titleWithCamelCase',
            { _: 'Title with camel case' },
        ]);
    });

    it('should ignore the source part corresponding to the parent in an iterator', () => {
        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'book.authors.2.categories.3.identifier.name',
            })
        ).toEqual([
            'resources.posts.fields.book.authors.categories.identifier.name',
            { _: 'Identifier name' },
        ]);
    });

    it.skip('should ignore the source part corresponding to embedded forms', () => {
        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                resourceFromContext: 'users',
                defaultLabel: 'resources.users.fields.name',
                source: 'referenceOne.users@@name',
            })
        ).toEqual(['resources.users.fields.name', { _: 'Name' }]);
    });

    it('should prefer the resource over the defaultLabel', () => {
        expect(
            getFieldLabelTranslationArgs({
                resource: 'books',
                defaultLabel: 'resources.posts.fields.title',
                source: 'title',
            })
        ).toEqual([`resources.books.fields.title`, { _: 'Title' }]);
    });

    it('should prefer the resource over the resourceFromContext', () => {
        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                resourceFromContext: 'books',
                source: 'title',
            })
        ).toEqual([`resources.posts.fields.title`, { _: 'Title' }]);
    });

    it('should prefer the defaultLabel over the resourceFromContext', () => {
        expect(
            getFieldLabelTranslationArgs({
                defaultLabel: 'resources.posts.fields.title',
                resourceFromContext: 'books',
                source: 'title',
            })
        ).toEqual([`resources.posts.fields.title`, { _: 'Title' }]);
    });

    it('should use the resourceFromContext when the resource and prefix are missing', () => {
        expect(
            getFieldLabelTranslationArgs({
                resourceFromContext: 'books',
                source: 'title',
            })
        ).toEqual([`resources.books.fields.title`, { _: 'Title' }]);
    });
});
