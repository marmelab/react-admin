import { useCallback, isValidElement } from 'react';
import set from 'lodash/set';
import useChoices, { UseChoicesOptions } from './useChoices';
import { useTranslate } from '../i18n';

/*
 * Returns helper functions for suggestions handling.
 *
 * @param allowDuplicates A boolean indicating whether a suggestion can be added several times
 * @param allowEmpty A boolean indicating whether an empty suggestion should be added
 * @param choices An array of available choices
 * @param emptyText The text to use for the empty suggestion. Defaults to an empty string
 * @param emptyValue The value to use for the empty suggestion. Defaults to `null`
 * @param limitChoicesToValue A boolean indicating whether the initial suggestions should be limited to the currently selected one(s)
 * @param matchSuggestion Optional unless `optionText` is a React element. Function which check whether a choice matches a filter. Must return a boolean.
 * @param optionText Either a string defining the property to use to get the choice text, a function or a React element
 * @param optionValue The property to use to get the choice value
 * @param selectedItem The currently selected item. May be an array of selected items
 * @param suggestionLimit The maximum number of suggestions returned, excluding the empty one if `allowEmpty` is `true`
 * @param translateChoice A boolean indicating whether to option text should be translated
 *
 * @returns An object with helper functions:
 * - getChoiceText: Returns the choice text or a React element
 * - getChoiceValue: Returns the choice value
 * - getSuggestions: A function taking a filter value (string) and returning the matching suggestions
 */
const useSuggestions = ({
    allowDuplicates,
    allowEmpty,
    choices,
    emptyText = '',
    emptyValue = null,
    limitChoicesToValue,
    matchSuggestion,
    optionText,
    optionValue,
    selectedItem,
    suggestionLimit = 0,
    translateChoice,
}: Options) => {
    const translate = useTranslate();
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getSuggestions = useCallback(
        getSuggestionsFactory({
            allowDuplicates,
            allowEmpty,
            choices,
            emptyText: translate(emptyText, { _: emptyText }),
            emptyValue,
            getChoiceText,
            getChoiceValue,
            limitChoicesToValue,
            matchSuggestion,
            optionText,
            optionValue,
            selectedItem,
            suggestionLimit,
        }),
        [
            allowDuplicates,
            allowEmpty,
            choices,
            emptyText,
            emptyValue,
            getChoiceText,
            getChoiceValue,
            limitChoicesToValue,
            matchSuggestion,
            optionText,
            optionValue,
            selectedItem,
            suggestionLimit,
            translate,
        ]
    );

    return {
        getChoiceText,
        getChoiceValue,
        getSuggestions,
    };
};

export default useSuggestions;

const escapeRegExp = value =>
    value ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''; // $& means the whole matched string

interface Options extends UseChoicesOptions {
    choices: any[];
    allowDuplicates?: boolean;
    allowEmpty?: boolean;
    emptyText?: string;
    emptyValue?: any;
    limitChoicesToValue?: boolean;
    matchSuggestion?: (filter: string, suggestion: any) => boolean;
    suggestionLimit?: number;
    selectedItem?: any | any[];
}

/**
 * Default matcher implementation which check whether the suggestion text matches the filter.
 */
const defaultMatchSuggestion = getChoiceText => (filter, suggestion) => {
    const suggestionText = getChoiceText(suggestion);

    const isReactElement = isValidElement(suggestionText);

    return isReactElement
        ? false
        : suggestionText &&
              suggestionText.match(
                  // We must escape any RegExp reserved characters to avoid errors
                  // For example, the filter might contains * which must be escaped as \*
                  new RegExp(escapeRegExp(filter), 'i')
              );
};

/**
 * Get the suggestions to display after applying a fuzzy search on the available choices
 *
 * @example
 *
 * getSuggestions({
 *   choices: [{ id: 1, name: 'admin' }, { id: 2, name: 'publisher' }],
 *   optionText: 'name',
 *   optionValue: 'id',
 *   getSuggestionText: choice => choice[optionText],
 * })('pub')
 *
 * // Will return [{ id: 2, name: 'publisher' }]
 * getSuggestions({
 *   choices: [{ id: 1, name: 'admin' }, { id: 2, name: 'publisher' }],
 *   optionText: 'name',
 *   optionValue: 'id',
 *   getSuggestionText: choice => choice[optionText],
 * })('pub')
 *
 * // Will return [{ id: 2, name: 'publisher' }]
 */
export const getSuggestionsFactory = ({
    choices = [],
    allowDuplicates,
    allowEmpty,
    emptyText,
    emptyValue,
    optionText,
    optionValue,
    getChoiceText,
    getChoiceValue,
    limitChoicesToValue = false,
    matchSuggestion = defaultMatchSuggestion(getChoiceText),
    selectedItem,
    suggestionLimit = 0,
}) => filter => {
    let suggestions = [];
    // if an item is selected and matches the filter
    if (
        selectedItem &&
        !Array.isArray(selectedItem) &&
        matchSuggestion(filter, selectedItem)
    ) {
        if (limitChoicesToValue) {
            // display only the selected item
            suggestions = choices.filter(
                choice =>
                    getChoiceValue(choice) === getChoiceValue(selectedItem)
            );
        } else if (!allowDuplicates) {
            // ignore the filter to show more choices
            suggestions = removeAlreadySelectedSuggestions(
                choices,
                selectedItem,
                getChoiceValue
            );
        } else {
            suggestions = choices;
        }
    } else {
        suggestions = choices.filter(choice => matchSuggestion(filter, choice));
        if (!allowDuplicates) {
            suggestions = removeAlreadySelectedSuggestions(
                suggestions,
                selectedItem,
                getChoiceValue
            );
        }
    }

    suggestions = limitSuggestions(suggestions, suggestionLimit);

    if (allowEmpty) {
        suggestions = addEmptySuggestion(suggestions, {
            optionText,
            optionValue,
            emptyText,
            emptyValue,
        });
    }

    return suggestions;
};

/**
 * @example
 *
 * removeAlreadySelectedSuggestions(
 *  [{ id: 1, name: 'foo'}, { id: 2, name: 'bar' }],
 *  [{ id: 1, name: 'foo'}]
 * );
 *
 * // Will return [{ id: 2, name: 'bar' }]
 *
 * @param suggestions List of suggestions
 * @param selectedItems List of selection
 * @param getChoiceValue Converter function from suggestion to value
 */
const removeAlreadySelectedSuggestions = (
    suggestions: any[],
    selectedItems: any[] | any,
    getChoiceValue: (suggestion: any) => any
) => {
    if (!selectedItems) {
        return suggestions;
    }
    const selectedValues = Array.isArray(selectedItems)
        ? selectedItems.map(getChoiceValue)
        : [getChoiceValue(selectedItems)];

    return suggestions.filter(
        suggestion => !selectedValues.includes(getChoiceValue(suggestion))
    );
};

/**
 * @example
 *
 * limitSuggestions(
 *  [{ id: 1, name: 'foo'}, { id: 2, name: 'bar' }],
 *  1
 * );
 *
 * // Will return [{ id: 1, name: 'foo' }]
 *
 * @param suggestions List of suggestions
 * @param limit
 */
const limitSuggestions = (suggestions: any[], limit: any = 0) =>
    Number.isInteger(limit) && limit > 0
        ? suggestions.slice(0, limit)
        : suggestions;

/**
 * addEmptySuggestion(
 *  [{ id: 1, name: 'foo'}, { id: 2, name: 'bar' }],
 * );
 *
 * // Will return [{ id: null, name: '' }, { id: 1, name: 'foo' }, , { id: 2, name: 'bar' }]
 *
 * @param suggestions List of suggestions
 * @param options
 */
const addEmptySuggestion = (
    suggestions: any[],
    {
        optionText = 'name',
        optionValue = 'id',
        emptyText = '',
        emptyValue = null,
    }
) => {
    let newSuggestions = suggestions;

    const emptySuggestion = {};
    set(emptySuggestion, optionValue, emptyValue);
    if (typeof optionText === 'string') {
        set(emptySuggestion, optionText, emptyText);
    }

    return [].concat(emptySuggestion, newSuggestions);
};
