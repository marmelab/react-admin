import assert from 'assert';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

describe('getFieldLabelTranslationArgs', () => {
    it('should return empty span by default', () => assert.deepEqual(getFieldLabelTranslationArgs(), ['']));

    it('should return the label when given', () =>
        assert.deepEqual(
            getFieldLabelTranslationArgs({
                label: 'foo',
                resource: 'posts',
                source: 'title',
            }),
            ['foo', { _: 'foo' }]
        ));

    it('should return the humanized source when given', () => {
        assert.deepEqual(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title',
            }),
            [`resources.posts.fields.title`, { _: 'Title' }]
        );

        assert.deepEqual(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title_with_underscore',
            }),
            [`resources.posts.fields.title_with_underscore`, { _: 'Title with underscore' }]
        );

        assert.deepEqual(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'titleWithCamelCase',
            }),
            [`resources.posts.fields.titleWithCamelCase`, { _: 'Title with camel case' }]
        );
    });

    it('should return the source and resource as translate key', () =>
        assert.deepEqual(
            getFieldLabelTranslationArgs({
                resource: 'posts',
                source: 'title',
            }),
            [`resources.posts.fields.title`, { _: 'Title' }]
        ));
});
