import {
    resolveBrowserLocale,
    mergeTranslations,
    DEFAULT_LOCALE,
} from './index';

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

    describe('mergeTranslations', () => {
        it('Merge translations modules', () => {
            const defaultMessages = {
                ra: { action: { save: 'Save', edit: 'Edit' } },
            };
            const addonMessages = {
                ra: { tree: { dragPreview: 'Node %id%' } },
            };
            const customPackageWithOverrides = {
                ra: {
                    action: { edit: 'Modify', saveAndAdd: 'Save and add' },
                },
            };
            expect(
                mergeTranslations(
                    defaultMessages,
                    addonMessages,
                    customPackageWithOverrides
                )
            ).toEqual({
                ra: {
                    action: {
                        save: 'Save',
                        edit: 'Modify',
                        saveAndAdd: 'Save and add',
                    },
                    tree: { dragPreview: 'Node %id%' },
                },
            });
        });
    });
});
