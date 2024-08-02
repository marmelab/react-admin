import { getRecordForLocale } from './useTranslatable';
describe('useTranslatable', () => {
    describe('getRecordForLocale', () => {
        it('should return a record where translatable fields have their values set to the value of the given locale', () => {
            // Given the record { title: { en: 'title_en', fr: 'title_fr' } } and the locale 'fr',
            // the record for the locale 'fr' will be { title: 'title_fr' }
            const record = {
                nullEntry: null,
                fractal: true,
                title: { en: 'title_en', fr: 'title_fr' },
                items: [
                    { description: { en: 'item1_en', fr: 'item1_fr' } },
                    { description: { en: 'item2_en', fr: 'item2_fr' } },
                ],
            };

            const recordForLocale = getRecordForLocale(record, 'fr');

            expect(recordForLocale).toEqual({
                nullEntry: null,
                fractal: true,
                title: 'title_fr',
                items: [
                    { description: 'item1_fr' },
                    { description: 'item2_fr' },
                ],
            });
        });

        it('should return the record as is if it is empty', () => {
            const record = {};
            const recordForLocale = getRecordForLocale(record, 'fr');
            expect(recordForLocale).toEqual({});
        });

        it('should return the record as is if it is undefined', () => {
            const record = undefined;
            const recordForLocale = getRecordForLocale(record, 'fr');
            expect(recordForLocale).toEqual(undefined);
        });
    });
});
