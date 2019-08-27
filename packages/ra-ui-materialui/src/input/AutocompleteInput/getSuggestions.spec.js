import getSuggestions from './getSuggestions';

describe('getSuggestions', () => {
    const choices = [
        { id: 1, value: 'one' },
        { id: 2, value: 'two' },
        { id: 3, value: 'three' },
    ];

    it('should return suggestions based on choices', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
            })('')
        ).toEqual(choices);
    });

    it('should filter choices based on second argument', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
            })('o')
        ).toEqual([{ id: 1, value: 'one' }, { id: 2, value: 'two' }]);
    });

    it('should filter choices based on second argument when it contains RegExp reserved characters', () => {
        expect(
            getSuggestions({
                choices: [
                    { id: 1, value: '**one' },
                    { id: 2, value: 'two' },
                    { id: 3, value: 'three' },
                ],
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
            })('**o')
        ).toEqual([{ id: 1, value: '**one' }]);
    });

    it('should not filter choices based on second argument if limitChoicesToValue is false', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: false,
            })('o')
        ).toEqual(choices);
    });

    it('should add emptySuggestion if allowEmpty is true', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: true,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: 3, value: 'three' },
            { id: null, value: '' },
        ]);
    });
});
