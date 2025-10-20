import { I18nProvider } from '../types';

export const defaultI18nProvider: I18nProvider = {
    translate: (key: string, options: any = {}) => {
        if (options._) {
            return options._;
        }
        return key;
    },
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
};
