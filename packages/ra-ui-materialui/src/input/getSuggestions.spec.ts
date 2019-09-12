import getSuggestions from './getSuggestions';

describe('getSuggestions', () => {
    const choices = [
        { id: 1, value: 'one' },
        { id: 2, value: 'two' },
        { id: 3, value: 'three' },
    ];

    it('should return all suggestions when filtered by empty string', () => {
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

    it('should filter choices according to the filter argument', () => {
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

    it('should filter choices according to the filter argument when it contains RegExp reserved characters', () => {
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

    it('should filter choices according to the currently selected values if limitChoicesToValue is false', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: false,
                selectedItem: [choices[0]],
            })('')
        ).toEqual(choices.slice(1));
    });

    it('should filter choices according to the currently selected values if limitChoicesToValue is true', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
                selectedItem: [choices[0]],
            })('')
        ).toEqual(choices.slice(1));
    });

    it('should not filter choices according to the currently selected value if limitChoicesToValue is false', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: false,
                selectedItem: choices[0],
            })('one')
        ).toEqual(choices);
    });

    it('should filter choices according to the currently selected value if limitChoicesToValue is true', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
                selectedItem: choices[0],
            })('one')
        ).toEqual([choices[0]]);
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

    it('should limit the number of choices', () => {
        expect(
            getSuggestions({
                choices,
                allowEmpty: false,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
                suggestionLimit: 2,
            })('')
        ).toEqual([{ id: 1, value: 'one' }, { id: 2, value: 'two' }]);

        expect(
            getSuggestions({
                choices,
                allowEmpty: true,
                optionText: 'value',
                getSuggestionText: ({ value }) => value,
                optionValue: 'id',
                limitChoicesToValue: true,
                suggestionLimit: 2,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: null, value: '' },
        ]);
    });
});
