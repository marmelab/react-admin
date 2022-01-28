import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { useTranslate } from './useTranslate';
import { TranslationProvider } from './TranslationProvider';
import { TranslationContext } from './TranslationContext';

describe('useTranslate', () => {
    const Component = () => {
        const translate = useTranslate();
        return <div>{translate('hello')}</div>;
    };

    it('should not fail when used outside of a translation provider', () => {
        render(<Component />);
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use the i18nProvider.translate() method', () => {
        render(
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
        expect(screen.queryAllByText('hello')).toHaveLength(0);
        expect(screen.queryAllByText('hallo')).toHaveLength(1);
    });

    it('should use the i18n provider when using TranslationProvider', () => {
        render(
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
        expect(screen.queryAllByText('hello')).toHaveLength(0);
        expect(screen.queryAllByText('bonjour')).toHaveLength(1);
    });
});
