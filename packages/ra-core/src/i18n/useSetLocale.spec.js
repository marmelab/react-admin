import * as React from 'react';
import expect from 'expect';
import { fireEvent, waitFor, act } from '@testing-library/react';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import useTranslate from './useTranslate';
import useSetLocale from './useSetLocale';
import { TranslationContext, TranslationProvider } from './';
import { renderWithRedux } from 'ra-test';

describe('useSetLocale', () => {
    const Component = () => {
        const translate = useTranslate();
        const setLocale = useSetLocale();
        return (
            <div>
                {translate('hello')}
                <button onClick={() => setLocale('fr')}>Français</button>
            </div>
        );
    };

    it('should not fail when used outside of a translation provider', () => {
        const { queryAllByText } = renderWithRedux(<Component />);
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use the setLocale function set in the translation context', async () => {
        const setLocale = jest.fn();
        const { getByText } = renderWithRedux(
            <TranslationContext.Provider
                value={{
                    i18nProvider: {
                        translate: () => '',
                        changeLocale: () => Promise.resolve(),
                    },
                    locale: 'de',
                    setLocale,
                }}
            >
                <Component />
            </TranslationContext.Provider>
        );
        fireEvent.click(getByText('Français'));
        await waitFor(() => {
            expect(setLocale).toHaveBeenCalledTimes(1);
        });
    });

    it('should use the i18n provider when using TranslationProvider', async () => {
        const i18nProvider = polyglotI18nProvider(locale => {
            if (locale === 'en') return { hello: 'hello' };
            if (locale === 'fr') return { hello: 'bonjour' };
        });
        const { getByText, queryAllByText } = renderWithRedux(
            <TranslationProvider locale="en" i18nProvider={i18nProvider}>
                <Component />
            </TranslationProvider>
        );
        expect(queryAllByText('hello')).toHaveLength(1);
        expect(queryAllByText('bonjour')).toHaveLength(0);
        act(() => {
            fireEvent.click(getByText('Français'));
        });
        await waitFor(() => {
            expect(queryAllByText('hello')).toHaveLength(0);
            expect(queryAllByText('bonjour')).toHaveLength(1);
        });
    });
});
