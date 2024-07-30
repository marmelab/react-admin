import { useCallback, isValidElement, ReactElement } from 'react';
import set from 'lodash/set';
import { useChoices, OptionText, UseChoicesOptions } from './useChoices';
import { useTranslate } from '../i18n';

/*
 * Returns helper functions for suggestions handling.
 *
 * @param allowDuplicates A boolean indicating whether a suggestion can be added several times
 * @param choices An array of available choices
 * @param limitChoicesToValue A boolean indicating whether the initial suggestions should be limited to the currently selected one(s)
 * @param matchSuggestion Optional unless `optionText` is a React element. Function which check whether a choice matches a filter. Must return a boolean.
 * @param optionText Either a string defining the property to use to get the choice text, a function or a React element
 * @param optionValue The property to use to get the choice value
 * @param selectedItem The currently selected item. Maybe an array of selected items
 * @param suggestionLimit The maximum number of suggestions returned
 * @param translateChoice A boolean indicating whether to option text should be translated
 *
 * @returns An object with helper functions:
 * - getChoiceText: Returns the choice text or a React element
 * - getChoiceValue: Returns the choice value
 * - getSuggestions: A function taking a filter value (string) and returning the matching suggestions
 */
export const useSuggestions = ({
    allowCreate,
    choices,
    createText = 'ra.action.create',
    createValue = '@@create',
    limitChoicesToValue,
    matchSuggestion,
    optionText,
    optionValue,
    selectedItem,
    suggestionLimit = 0,
    translateChoice,
}: UseSuggestionsOptions) => {
    const translate = useTranslate();
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getSuggestions = useCallback(
        getSuggestionsFactory({
            allowCreate,
            choices,
            createText,
            createValue,
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
            allowCreate,
            choices,
            createText,
            createValue,
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

const escapeRegExp = value =>
    value ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''; // $& means the whole matched string

export interface UseSuggestionsOptions extends UseChoicesOptions {
    allowCreate?: boolean;
    allowDuplicates?: boolean;
    choices?: any[];
    createText?: string;
    createValue?: any;
    limitChoicesToValue?: boolean;
    matchSuggestion?: (
        filter: string,
        suggestion: any,
        exact?: boolean
    ) => boolean;
    suggestionLimit?: number;
    selectedItem?: any | any[];
}

/**
 * Default matcher implementation which check whether the suggestion text matches the filter.
 */
const defaultMatchSuggestion =
    getChoiceText =>
    (filter, suggestion, exact = false) => {
        const suggestionText = getChoiceText(suggestion);

        const isReactElement = isValidElement(suggestionText);
        const regex = escapeRegExp(filter);

        return isReactElement
            ? false
            : suggestionText &&
                  !!suggestionText.match(
                      // We must escape any RegExp reserved characters to avoid errors
                      // For example, the filter might contain * which must be escaped as \*
                      new RegExp(exact ? `^${regex}$` : regex, 'i')
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
export const getSuggestionsFactory =
    ({
        allowCreate = false,
        choices = [],
        createText = 'ra.action.create',
        createValue = '@@create',
        optionText = 'name',
        optionValue = 'id',
        getChoiceText,
        getChoiceValue,
        limitChoicesToValue = false,
        matchSuggestion = defaultMatchSuggestion(getChoiceText),
        selectedItem,
        suggestionLimit = 0,
    }: UseSuggestionsOptions & {
        getChoiceText: (choice: any) => string | ReactElement;
        getChoiceValue: (choice: any) => string;
    }) =>
    filter => {
        let suggestions: any[] = [];
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
            } else {
                suggestions = [...choices];
            }
        } else {
            suggestions = choices.filter(
                choice =>
                    matchSuggestion(filter, choice) ||
                    (selectedItem != null &&
                        (!Array.isArray(selectedItem)
                            ? getChoiceValue(choice) ===
                              getChoiceValue(selectedItem)
                            : selectedItem.some(
                                  selected =>
                                      getChoiceValue(choice) ===
                                      getChoiceValue(selected)
                              )))
            );
        }

        suggestions = limitSuggestions(suggestions, suggestionLimit);

        const hasExactMatch = suggestions.some(suggestion =>
            matchSuggestion(filter, suggestion, true)
        );

        if (allowCreate) {
            const filterIsSelectedItem =
                // If the selectedItem is an array (for example AutocompleteArrayInput)
                // we shouldn't try to match
                !!selectedItem && !Array.isArray(selectedItem)
                    ? matchSuggestion(filter, selectedItem, true)
                    : false;
            if (!hasExactMatch && !filterIsSelectedItem) {
                suggestions.push(
                    getSuggestion({
                        optionText,
                        optionValue,
                        text: createText,
                        value: createValue,
                    })
                );
            }
        }

        // Only keep unique items. Necessary because we might have fetched
        // the currently selected choice in addition of the possible choices
        // that may also contain it
        const result = suggestions.filter(
            (suggestion, index) => suggestions.indexOf(suggestion) === index
        );
        return result;
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
 * addSuggestion(
 *  [{ id: 1, name: 'foo'}, { id: 2, name: 'bar' }],
 * );
 *
 * // Will return [{ id: null, name: '' }, { id: 1, name: 'foo' }, { id: 2, name: 'bar' }]
 *
 * @param suggestions List of suggestions
 * @param options
 * @param options.optionText
 */
const getSuggestion = ({
    optionText = 'name',
    optionValue = 'id',
    text = '',
    value = null,
}: {
    optionText: OptionText;
    optionValue: string;
    text: string;
    value: any;
}) => {
    const suggestion = {};
    set(suggestion, optionValue, value);
    if (typeof optionText === 'string') {
        set(suggestion, optionText, text);
    }

    return suggestion;
};
