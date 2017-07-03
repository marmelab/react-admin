import assert from 'assert';

import { resolveBrowserLocale, DEFAULT_LOCALE } from './index';

describe('TranslationUtils', () => {
    describe('resolveBrowserLocale', () => {
        beforeEach(() => {
            global.window = {};
        });

        it("should return default locale if there's no available locale in browser", () => {
            window.navigator = {};
            assert(resolveBrowserLocale(), DEFAULT_LOCALE);
        });

        it('should splice browser language to take first two locale letters', () => {
            window.navigator = { language: 'en-US' };
            assert(resolveBrowserLocale(), 'en');
        });
    });
});
