import expect from 'expect';
import { getSuggestionsFactory as getSuggestions } from './useSuggestions';

describe('getSuggestions', () => {
    const choices = [
        { id: 1, value: 'one' },
        { id: 2, value: 'two' },
        { id: 3, value: 'three' },
    ];

    const defaultOptions = {
        choices,
        allowEmpty: false,
        emptyText: '',
        emptyValue: null,
        getChoiceText: ({ value }) => value,
        getChoiceValue: ({ id }) => id,
        limitChoicesToValue: false,
        matchSuggestion: undefined,
        optionText: 'value',
        optionValue: 'id',
        selectedItem: undefined,
    };

    it('should return all suggestions when filtered by empty string', () => {
        expect(getSuggestions(defaultOptions)('')).toEqual(choices);
    });

    it('should filter choices according to the filter argument', () => {
        expect(getSuggestions(defaultOptions)('o')).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
        ]);
    });

    it('should filter choices according to the filter argument when it contains RegExp reserved characters', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                choices: [
                    { id: 1, value: '**one' },
                    { id: 2, value: 'two' },
                    { id: 3, value: 'three' },
                ],
            })('**o')
        ).toEqual([{ id: 1, value: '**one' }]);
    });

    it('should filter choices according to the currently selected values if selectedItem is an array', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                selectedItem: [choices[0]],
            })('')
        ).toEqual(choices.slice(1));
    });

    it('should not filter choices according to the currently selected value if selectedItem is not an array and limitChoicesToValue is false', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                limitChoicesToValue: false,
                selectedItem: choices[0],
            })('one')
        ).toEqual(choices);
    });

    it('should filter choices according to the currently selected value if selectedItem is not an array and limitChoicesToValue is true', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                limitChoicesToValue: true,
                selectedItem: choices[0],
            })('one')
        ).toEqual([choices[0]]);
    });
    it('should add emptySuggestion if allowEmpty is true', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                allowEmpty: true,
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
                ...defaultOptions,
                suggestionLimit: 2,
            })('')
        ).toEqual([{ id: 1, value: 'one' }, { id: 2, value: 'two' }]);

        expect(
            getSuggestions({
                ...defaultOptions,
                suggestionLimit: 2,
                allowEmpty: true,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: null, value: '' },
        ]);
    });
});
