import * as React from 'react';
import lodashGet from 'lodash/get';

import { TranslationContext } from './TranslationContext';

export default ({ translate, messages, children }: any) => (
    <TranslationContext.Provider
        value={{
            locale: 'en',
            setLocale: () => Promise.resolve(),
            i18nProvider: {
                translate: messages
                    ? (key: string, options?: any) =>
                          lodashGet(messages, key)
                              ? lodashGet(messages, key)
                              : options._
                    : translate,
                changeLocale: () => Promise.resolve(),
                getLocale: () => 'en',
            },
        }}
    >
        {children}
    </TranslationContext.Provider>
);
