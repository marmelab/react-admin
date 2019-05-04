import assert from 'assert';
import expect from 'expect';
import { shallow } from 'enzyme';
import { render, cleanup } from 'react-testing-library';
import React from 'react';

import { FieldTitle } from './FieldTitle';
import TestContext from './TestContext';

describe('FieldTitle', () => {
    afterEach(cleanup);

    const translateMock = dictionary => (term, options) =>
        dictionary[term] || options._ || '';

    it('should return empty span by default', () => {
        const { container } = render(<FieldTitle />);
        expect(container.firstChild).toBeInstanceOf(HTMLSpanElement);
        expect(container.firstChild.textContent).toEqual('');
    });

    it('should use the label when given', () => {
        const { container } = render(<FieldTitle label="foo" />);
        expect(container.firstChild.textContent).toEqual('foo');
    });

    it('should use the label as translate key when translation is available', () => {
        const { container } = render(
            <TestContext store={{ i18n: { messages: { foo: 'bar' } } }}>
                <FieldTitle label="foo" />
            </TestContext>
        );
        expect(container.firstChild.textContent).toEqual('bar');
    });

    it('should use the humanized source when given', () => {
        const { container } = render(
            <TestContext>
                <FieldTitle resource="posts" source="title" />
            </TestContext>
        );
        expect(container.firstChild.textContent).toEqual('Title');
    });

    it('should use the humanized source when given with underscores', () => {
        const { container } = render(
            <TestContext>
                <FieldTitle resource="posts" source="title_with_underscore" />
            </TestContext>
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with underscore'
        );
    });

    it('should use the humanized source when given with camelCase', () => {
        const { container } = render(
            <TestContext>
                <FieldTitle resource="posts" source="titleWithCamelCase" />
            </TestContext>
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with camel case'
        );
    });

    it('should use the source and resource as translate key when translation is available', () => {
        const { container } = render(
            <TestContext
                store={{
                    i18n: {
                        messages: { 'resources.posts.fields.title': 'titre' },
                    },
                }}
            >
                <FieldTitle resource="posts" source="title" />
            </TestContext>
        );
        expect(container.firstChild.textContent).toEqual('titre');
    });

    it('should use label rather than source', () => {
        const { container } = render(
            <FieldTitle label="foo" resource="posts" source="title" />
        );
        expect(container.firstChild.textContent).toEqual('foo');
    });

    it('should add a trailing asterisk if the field is required', () => {
        const { container } = render(<FieldTitle label="foo" isRequired />);
        expect(container.firstChild.textContent).toEqual('foo *');
    });
});
