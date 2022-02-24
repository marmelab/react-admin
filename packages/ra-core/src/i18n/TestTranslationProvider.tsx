import * as React from 'react';
import lodashGet from 'lodash/get';

import { I18nContextProvider } from './I18nContextProvider';

export const TestTranslationProvider = ({
    translate,
    messages,
    children,
}: any) => (
    <I18nContextProvider
        value={{
            translate: messages
                ? (key: string, options?: any) =>
                      lodashGet(messages, key)
                          ? lodashGet(messages, key)
                          : options._
                : translate,
            changeLocale: () => Promise.resolve(),
            getLocale: () => 'en',
        }}
    >
        {children}
    </I18nContextProvider>
);
