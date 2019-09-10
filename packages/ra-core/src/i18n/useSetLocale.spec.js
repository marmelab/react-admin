import React from 'react';
import expect from 'expect';
import { render, fireEvent, cleanup, wait, act } from '@testing-library/react';

import useTranslate from './useTranslate';
import useSetLocale from './useSetLocale';
import TranslationProvider from './TranslationProvider';
import { TranslationContext } from './TranslationContext';

describe('useTranslate', () => {
    afterEach(cleanup);

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
        const { queryAllByText } = render(<Component />);
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use the setLocale function set in the translation context', () => {
        const setLocale = jest.fn();
        const { getByText } = render(
            <TranslationContext.Provider
                value={{
                    locale: 'de',
                    translate: () => 'hallo',
                    provider: () => ({}),
                    setLocale,
                }}
            >
                <Component />
            </TranslationContext.Provider>
        );
        fireEvent.click(getByText('Français'));
        expect(setLocale).toHaveBeenCalledTimes(1);
    });

    it('should use the i18n provider when using TranslationProvider', async () => {
        const i18nProvider = locale => {
            if (locale === 'en') return { hello: 'hello' };
            if (locale === 'fr') return { hello: 'bonjour' };
        };
        const { getByText, queryAllByText } = render(
            <TranslationProvider locale="en" i18nProvider={i18nProvider}>
                <Component />
            </TranslationProvider>
        );
        expect(queryAllByText('hello')).toHaveLength(1);
        expect(queryAllByText('bonjour')).toHaveLength(0);
        act(() => {
            fireEvent.click(getByText('Français'));
        });
        await wait();
        expect(queryAllByText('hello')).toHaveLength(0);
        expect(queryAllByText('bonjour')).toHaveLength(1);
    });
});
