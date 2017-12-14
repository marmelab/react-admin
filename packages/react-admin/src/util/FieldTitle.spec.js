import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { FieldTitle } from './FieldTitle';

describe('FieldTitle', () => {
    const translateMock = dictionary => (term, options) =>
        dictionary[term] || options._ || '';
    test('should return empty span by default', () =>
        assert.equal(shallow(<FieldTitle />).html(), '<span></span>'));
    test('should use the label when given', () =>
        assert.equal(
            shallow(<FieldTitle label="foo" />).html(),
            '<span>foo</span>'
        ));
    test('should the label as translate key when translation is available', () =>
        assert.equal(
            shallow(
                <FieldTitle
                    label="foo"
                    translate={translateMock({ foo: 'bar' })}
                />
            ).html(),
            '<span>bar</span>'
        ));
    test('should use the humanized source when given', () =>
        assert.equal(
            shallow(
                <FieldTitle
                    resource="posts"
                    source="title"
                    translate={translateMock({})}
                />
            ).html(),
            '<span>Title</span>'
        ));
    test('should use the source and resource as translate key when translation is available', () =>
        assert.equal(
            shallow(
                <FieldTitle
                    resource="posts"
                    source="title"
                    translate={translateMock({
                        'resources.posts.fields.title': 'titre',
                    })}
                />
            ).html(),
            '<span>titre</span>'
        ));
    test('should use label rather than source', () =>
        assert.equal(
            shallow(
                <FieldTitle label="foo" resource="posts" source="title" />
            ).html(),
            '<span>foo</span>'
        ));
    test('should add a trailing asterisk if the field is required', () =>
        assert.equal(
            shallow(<FieldTitle label="foo" isRequired />).html(),
            '<span>foo *</span>'
        ));
});
