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
        getChoiceText: ({ value }) => value,
        getChoiceValue: ({ id }) => id,
        matchSuggestion: undefined,
        optionText: 'value',
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
        expect(
            getSuggestions({
                ...defaultOptions,
                choices: [
                    { id: 0, value: '0' },
                    { id: 1, value: 'one' },
                ],
            })('0')
        ).toEqual([{ id: 0, value: '0' }]);
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

    it('should add createSuggestion if allowCreate is true', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                allowCreate: true,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: 3, value: 'three' },
            { id: '@@create', value: 'ra.action.create' },
        ]);
    });

    it('should not add createSuggestion if allowCreate is true and the current filter matches exactly the selected item', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                selectedItem: { id: 1, value: 'one' },
                allowCreate: true,
            })('one')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: 3, value: 'three' },
        ]);
    });

    it('should add createSuggestion if allowCreate is true and selectedItem is an array', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                selectedItem: [
                    { id: 1, value: 'one' },
                    { id: 2, value: 'two' },
                ],
                allowCreate: true,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: 3, value: 'three' },
            { id: '@@create', value: 'ra.action.create' },
        ]);
    });

    it('should limit the number of choices', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                suggestionLimit: 2,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
        ]);

        expect(
            getSuggestions({
                ...defaultOptions,
                suggestionLimit: 2,
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
        ]);
    });

    it('should return all choices on empty/falsy values', () => {
        expect(getSuggestions(defaultOptions)(undefined)).toEqual(choices);
        expect(getSuggestions(defaultOptions)(false)).toEqual(choices);
        expect(getSuggestions(defaultOptions)(null)).toEqual(choices);
    });

    it('should return all choices if allowDuplicates is true', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                allowDuplicates: true,
                selectedItem: choices[0],
            })('')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
            { id: 3, value: 'three' },
        ]);
    });

    it('should return all the filtered choices if allowDuplicates is true', () => {
        expect(
            getSuggestions({
                ...defaultOptions,
                allowDuplicates: true,
                selectedItem: [choices[0]],
            })('o')
        ).toEqual([
            { id: 1, value: 'one' },
            { id: 2, value: 'two' },
        ]);
    });
});
