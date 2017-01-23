import { DEFAULT_LOCALE } from './index';

export default (initialLocale = DEFAULT_LOCALE) => (
    (previousLocale = initialLocale, { type }) => {
        switch (type) {
        default:
            return previousLocale;
        }
    }
);
