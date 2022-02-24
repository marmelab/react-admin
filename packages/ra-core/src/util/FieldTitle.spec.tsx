import expect from 'expect';
import { render } from '@testing-library/react';
import * as React from 'react';

import { FieldTitle } from './FieldTitle';
import { TestTranslationProvider } from '../i18n';

describe('FieldTitle', () => {
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
            <TestTranslationProvider messages={{ foo: 'bar' }}>
                <FieldTitle label="foo" />
            </TestTranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual('bar');
    });

    it('should use the humanized source when given', () => {
        const { container } = render(
            <TestTranslationProvider translate={(key, options) => options._}>
                <FieldTitle resource="posts" source="title" />
            </TestTranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual('Title');
    });

    it('should use the humanized source when given with underscores', () => {
        const { container } = render(
            <TestTranslationProvider translate={(key, options) => options._}>
                <FieldTitle resource="posts" source="title_with_underscore" />
            </TestTranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with underscore'
        );
    });

    it('should use the humanized source when given with camelCase', () => {
        const { container } = render(
            <TestTranslationProvider translate={(key, options) => options._}>
                <FieldTitle resource="posts" source="titleWithCamelCase" />
            </TestTranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with camel case'
        );
    });

    it('should use the source and resource as translate key when translation is available', () => {
        const { container } = render(
            <TestTranslationProvider
                messages={{
                    'resources.posts.fields.title': 'titre',
                }}
            >
                <FieldTitle resource="posts" source="title" />
            </TestTranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual('titre');
    });

    it('should use label rather than source', () => {
        const { container } = render(
            <FieldTitle label="foo" resource="posts" source="title" />
        );
        expect(container.firstChild.textContent).toEqual('foo');
    });

    it('should return null if label is false', () => {
        const { container } = render(<FieldTitle label={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null if label is empty string', () => {
        const { container } = render(<FieldTitle label="" />);
        expect(container.firstChild).toBeNull();
    });
});
