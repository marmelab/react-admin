import { getFilterFormValues } from './AutoSubmitFilterForm';

describe('<AutoSubmitFilterForm />', () => {
    describe('getFilterFormValues', () => {
        it('should correctly get the filter form values from the new filterValues', () => {
            const currentFormValues = {
                classicToClear: 'abc',
                nestedToClear: { nestedValue: 'def' },
                classicUpdated: 'ghi',
                nestedUpdated: { nestedValue: 'jkl' },
                nestedToSet: { nestedValue: undefined },
                published_at: new Date('2022-01-01T03:00:00.000Z'),
                clearedDateValue: null,
            };
            const newFilterValues = {
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                nestedToSet: { nestedValue: 'mno2' },
                published_at: '2022-01-01T03:00:00.000Z',
            };

            expect(
                getFilterFormValues(currentFormValues, newFilterValues)
            ).toEqual({
                classicToClear: '',
                nestedToClear: { nestedValue: '' },
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                nestedToSet: { nestedValue: 'mno2' },
                published_at: '2022-01-01T03:00:00.000Z',
                clearedDateValue: '',
            });
        });
    });
});
