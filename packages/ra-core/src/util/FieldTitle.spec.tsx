import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

import { FieldTitle } from './FieldTitle';
import TranslationProvider from '../i18n/TranslationProvider';

describe('FieldTitle', () => {
    afterEach(cleanup);

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
            <TranslationProvider i18nProvider={() => ({ foo: 'bar' })}>
                <FieldTitle label="foo" />
            </TranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual('bar');
    });

    it('should use the humanized source when given', () => {
        const { container } = render(
            <TranslationProvider i18nProvider={() => ({})}>
                <FieldTitle resource="posts" source="title" />
            </TranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual('Title');
    });

    it('should use the humanized source when given with underscores', () => {
        const { container } = render(
            <TranslationProvider i18nProvider={() => ({})}>
                <FieldTitle resource="posts" source="title_with_underscore" />
            </TranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with underscore'
        );
    });

    it('should use the humanized source when given with camelCase', () => {
        const { container } = render(
            <TranslationProvider i18nProvider={() => ({})}>
                <FieldTitle resource="posts" source="titleWithCamelCase" />
            </TranslationProvider>
        );
        expect(container.firstChild.textContent).toEqual(
            'Title with camel case'
        );
    });

    it('should use the source and resource as translate key when translation is available', () => {
        const { container } = render(
            <TranslationProvider
                i18nProvider={() => ({
                    'resources.posts.fields.title': 'titre',
                })}
            >
                <FieldTitle resource="posts" source="title" />
            </TranslationProvider>
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
