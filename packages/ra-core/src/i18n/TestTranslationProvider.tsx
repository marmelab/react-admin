import React from 'react';
import lodashGet from 'lodash/get';

import { TranslationContext } from './TranslationContext';

export default ({ translate, messages, children }: any) => (
    <TranslationContext.Provider
        value={{
            locale: 'en',
            setLocale: () => Promise.resolve(),
            i18nProvider: (_, options) =>
                messages
                    ? lodashGet(messages, options[0])
                        ? lodashGet(messages, options[0])
                        : options[1]._
                    : translate.apply(null, options),
        }}
    >
        {children}
    </TranslationContext.Provider>
);
