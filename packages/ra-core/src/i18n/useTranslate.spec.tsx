import React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';

import useTranslate from './useTranslate';
import TranslationProvider from './TranslationProvider';
import { TranslationContext } from './TranslationContext';
import { renderWithRedux } from '../util';

describe('useTranslate', () => {
    afterEach(cleanup);

    const Component = () => {
        const translate = useTranslate();
        return <div>{translate('hello')}</div>;
    };

    it('should not fail when used outside of a translation provider', () => {
        const { queryAllByText } = renderWithRedux(<Component />);
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use the i18nProvider I18N_TRANSLATE verb', () => {
        const { queryAllByText } = renderWithRedux(
            <TranslationContext.Provider
                value={{
                    locale: 'de',
                    i18nProvider: type =>
                        type === 'I18N_TRANSLATE' ? 'hallo' : '',
                    setLocale: () => Promise.resolve(),
                }}
            >
                <Component />
            </TranslationContext.Provider>
        );
        expect(queryAllByText('hello')).toHaveLength(0);
        expect(queryAllByText('hallo')).toHaveLength(1);
    });

    it('should use the i18n provider when using TranslationProvider', () => {
        const { queryAllByText } = renderWithRedux(
            <TranslationProvider locale="fr" i18nProvider={() => 'bonjour'}>
                <Component />
            </TranslationProvider>
        );
        expect(queryAllByText('hello')).toHaveLength(0);
        expect(queryAllByText('bonjour')).toHaveLength(1);
    });
});
