import expect from 'expect';
import {
    resolveBrowserLocale,
    mergeTranslations,
    DEFAULT_LOCALE,
} from './index';

describe('TranslationUtils', () => {
    describe('resolveBrowserLocale', () => {
        let languageGetter;
        beforeEach(() => {
            //https://stackoverflow.com/questions/52868727/how-to-mock-window-navigator-language-using-jest
            // @ts-ignore
            languageGetter = jest.spyOn(window.navigator, 'language', 'get');
            languageGetter.mockReturnValue('en-US');
        });

        it("should return default locale if there's no available locale in browser", () => {
            // @ts-ignore
            languageGetter.mockReturnValue(undefined);
            expect(resolveBrowserLocale()).toEqual(DEFAULT_LOCALE);
        });

        it('should splice browser language to take first two locale letters', () => {
            // @ts-ignore
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
