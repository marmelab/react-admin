import assert from 'assert';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import React from 'react';

import { FieldTitle } from './FieldTitle';
import renderWithRedux from './renderWithRedux';

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
        const { container } = renderWithRedux(<FieldTitle label="foo" />, {
            i18n: { messages: { foo: 'bar' } },
        });
        expect(container.firstChild.textContent).toEqual('bar');
    });

    it('should use the humanized source when given', () => {
        const { container } = renderWithRedux(
            <FieldTitle resource="posts" source="title" />
        );
        expect(container.firstChild.textContent).toEqual('Title');
    });

    it('should use the humanized source when given with underscores', () => {
        const { container } = renderWithRedux(
            <FieldTitle resource="posts" source="title_with_underscore" />
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with underscore'
        );
    });

    it('should use the humanized source when given with camelCase', () => {
        const { container } = renderWithRedux(
            <FieldTitle resource="posts" source="titleWithCamelCase" />
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with camel case'
        );
    });

    it('should use the source and resource as translate key when translation is available', () => {
        const { container } = renderWithRedux(
            <FieldTitle resource="posts" source="title" />,
            {
                i18n: {
                    messages: { 'resources.posts.fields.title': 'titre' },
                },
            }
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
