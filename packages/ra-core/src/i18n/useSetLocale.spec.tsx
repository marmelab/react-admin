import * as React from 'react';
import expect from 'expect';
import {
    render,
    fireEvent,
    waitFor,
    act,
    screen,
} from '@testing-library/react';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { StoreContextProvider, memoryStore } from '../store';
import { useTranslate } from './useTranslate';
import { useSetLocale } from './useSetLocale';
import { I18nContextProvider } from './I18nContextProvider';

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
        render(<Component />);
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use the dataProvider.changeLocale function', async () => {
        const changeLocale = jest.fn().mockResolvedValue();
        render(
            <StoreContextProvider value={memoryStore()}>
                <I18nContextProvider
                    value={{
                        translate: () => '',
                        changeLocale,
                        getLocale: () => 'de',
                    }}
                >
                    <Component />
                </I18nContextProvider>
            </StoreContextProvider>
        );
        fireEvent.click(screen.getByText('Français'));
        await waitFor(() => {
            expect(changeLocale).toHaveBeenCalledTimes(1);
        });
    });

    it('should render the I18NcontextProvider children with the new locale', async () => {
        const i18nProvider = polyglotI18nProvider(locale => {
            if (locale === 'en') return { hello: 'hello' };
            if (locale === 'fr') return { hello: 'bonjour' };
        });
        render(
            <StoreContextProvider value={memoryStore()}>
                <I18nContextProvider value={i18nProvider}>
                    <Component />
                </I18nContextProvider>
            </StoreContextProvider>
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
        expect(screen.queryAllByText('bonjour')).toHaveLength(0);
        act(() => {
            fireEvent.click(screen.getByText('Français'));
        });
        await waitFor(() => {
            expect(screen.queryAllByText('hello')).toHaveLength(0);
            expect(screen.queryAllByText('bonjour')).toHaveLength(1);
        });
    });
});
