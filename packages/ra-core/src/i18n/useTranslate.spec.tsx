import * as React from 'react';
import expect from 'expect';

import useTranslate from './useTranslate';
import TranslationProvider from './TranslationProvider';
import { TranslationContext } from './TranslationContext';
import { renderWithRedux } from 'ra-test';

describe('useTranslate', () => {
    const Component = () => {
        const translate = useTranslate();
        return <div>{translate('hello')}</div>;
    };

    it('should not fail when used outside of a translation provider', () => {
        const { queryAllByText } = renderWithRedux(<Component />);
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use the i18nProvider.translate() method', () => {
        const { queryAllByText } = renderWithRedux(
            <TranslationContext.Provider
                value={{
                    locale: 'de',
                    i18nProvider: {
                        translate: () => 'hallo',
                        changeLocale: () => Promise.resolve(),
                        getLocale: () => 'de',
                    },
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
            <TranslationProvider
                i18nProvider={{
                    translate: () => 'bonjour',
                    changeLocale: () => Promise.resolve(),
                    getLocale: () => 'fr',
                }}
            >
                <Component />
            </TranslationProvider>
        );
        expect(queryAllByText('hello')).toHaveLength(0);
        expect(queryAllByText('bonjour')).toHaveLength(1);
    });
});
