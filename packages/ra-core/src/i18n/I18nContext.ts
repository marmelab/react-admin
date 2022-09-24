import { createContext } from 'react';
import { I18nProvider } from '../types';

export type I18nContextProps = I18nProvider;

// tokens are like 'Hello, %{name}'
const defaultTokenRegex = /%\{(.*?)\}/g;

/**
 * Replace tokens by their value in the given string
 *
 * @param {string} template The template with interpolation tokens, e.g. 'Hello, %{name}'
 * @param {object} data The data to interpolate, e.g. { name: 'John' }
 * @returns {string} The interpolated string, e.g. 'Hello, John'
 */
const substituteTokens = (template, data) =>
    template && data
        ? String.prototype.replace.call(template, defaultTokenRegex, function (
              expression,
              argument
          ) {
              if (!data.hasOwnProperty(argument) || data[argument] == null) {
                  return expression;
              }
              return data[argument];
          })
        : template;

const defaultI18nProvider = {
    translate: (key, options) =>
        options?._
            ? substituteTokens(options._, options)
            : substituteTokens(key, options),
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
};

export const I18nContext = createContext<I18nProvider>(defaultI18nProvider);

I18nContext.displayName = 'I18nContext';
