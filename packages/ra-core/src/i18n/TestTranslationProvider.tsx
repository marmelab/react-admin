import * as React from 'react';
import lodashGet from 'lodash/get';

import { I18nContextProvider } from './I18nContextProvider';
import { I18nProvider } from '../types';

export const TestTranslationProvider = ({
    translate,
    messages,
    children,
}: any) => (
    <I18nContextProvider value={testI18nProvider({ translate, messages })}>
        {children}
    </I18nContextProvider>
);

export interface IMessages
    extends Record<string, string | ((options?: any) => string) | IMessages> {}

export const testI18nProvider = ({
    translate,
    messages,
}: {
    translate?: I18nProvider['translate'];
    messages?: IMessages;
} = {}): I18nProvider => {
    return {
        translate: messages
            ? (key, options) => {
                  const message = lodashGet(messages, key);
                  return message
                      ? typeof message === 'function'
                          ? message(options)
                          : message
                      : options?._ || key;
              }
            : translate || (key => key),
        changeLocale: () => Promise.resolve(),
        getLocale: () => 'en',
    };
};
