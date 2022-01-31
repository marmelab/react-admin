import * as React from 'react';
import lodashGet from 'lodash/get';

import { I18nContext } from './I18nContext';

export const TestTranslationProvider = ({
    translate,
    messages,
    children,
}: any) => (
    <I18nContext.Provider
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
    </I18nContext.Provider>
);
