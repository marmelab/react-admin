import expect from 'expect';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

describe('getFieldLabelTranslationArgs', () => {
    it('should return empty span by default', () =>
        expect(getFieldLabelTranslationArgs()).toEqual(['']));

    it('should return the label when given', () =>
        expect(
            getFieldLabelTranslationArgs({
                label: 'foo',
                resource: 'posts',
                source: 'title',
            })
        ).toEqual(['foo', { _: 'foo' }]));

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
            `resources.posts.fields.title_with_underscore`,
            { _: 'Title with underscore' },
        ]);

        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'titleWithCamelCase',
            })
        ).toEqual([
            `resources.posts.fields.titleWithCamelCase`,
            { _: 'Title with camel case' },
        ]);
    });

    it('should return the source and resource as translate key', () =>
        expect(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title',
            })
        ).toEqual([`resources.posts.fields.title`, { _: 'Title' }]));
});
