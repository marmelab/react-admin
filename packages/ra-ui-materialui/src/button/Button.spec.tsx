import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import {
    ReactNodeLabel,
    SimpleStringLabel,
    TranslationKeyLabel,
} from './Button.stories';

describe('<DeleteButton />', () => {
    it('should allow simple string as label', async () => {
        const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');
        const translate = jest.spyOn(i18nProvider, 'translate');
        render(<SimpleStringLabel i18nProvider={i18nProvider} />);
        await screen.findByText('A non translated string');
        expect(translate).toHaveBeenCalledWith('A non translated string', {
            _: 'A non translated string',
        });
    });
    it('should allow translation keys as label', async () => {
        const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');
        const translate = jest.spyOn(i18nProvider, 'translate');
        render(<TranslationKeyLabel i18nProvider={i18nProvider} />);
        await screen.findByText('Create');
        expect(translate).toHaveBeenCalledWith('ra.action.create', {
            _: 'ra.action.create',
        });
    });
    it('should ReactNode as label', async () => {
        const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');
        const translate = jest.spyOn(i18nProvider, 'translate');
        render(<ReactNodeLabel i18nProvider={i18nProvider} />);
        await screen.findByText('A ReactNode');
        expect(translate).not.toHaveBeenCalled();
    });
});
