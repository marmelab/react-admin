import { resolveBrowserLocale, DEFAULT_LOCALE } from './index';

describe('TranslationUtils', () => {
    describe('resolveBrowserLocale', () => {
        beforeEach(() => {
            global.window = {};
        });

        it("should return default locale if there's no available locale in browser", () => {
            window.navigator = {};
            expect(resolveBrowserLocale()).toEqual(DEFAULT_LOCALE);
        });

        it('should splice browser language to take first two locale letters', () => {
            window.navigator = { language: 'en-US' };
            expect(resolveBrowserLocale()).toEqual('en');
        });
    });
});
