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
                ? (key: string, options?: any) => {
                      const message = lodashGet(messages, key);
                      console.log({ key, options, message });
                      return message
                          ? typeof message === 'function'
                              ? message(options)
                              : message
                          : options?._ || key;
                  }
                : translate,
            changeLocale: () => Promise.resolve(),
            getLocale: () => 'en',
        }}
    >
        {children}
    </I18nContextProvider>
);
