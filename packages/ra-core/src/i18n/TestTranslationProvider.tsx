import React from 'react';
import lodashGet from 'lodash/get';

import { TranslationContext } from './TranslationContext';

export default ({ translate, messages, children }: any) => (
    <TranslationContext.Provider
        value={{
            locale: 'en',
            setLocale: () => Promise.resolve(),
            i18nProvider: (_, options: { key: string; options?: any }) =>
                messages
                    ? lodashGet(messages, options.key)
                        ? lodashGet(messages, options.key)
                        : options.options._
                    : translate.call(null, options.key, options.options),
        }}
    >
        {children}
    </TranslationContext.Provider>
);
