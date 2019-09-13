import { useCallback, isValidElement } from 'react';
import set from 'lodash/set';
import useChoices, { UseChoicesOptions } from './useChoices';
import { useTranslate } from '../i18n';

/*
 * Returns helper functions for suggestions handling.
 *
 * @param allowEmpty A boolean indicating whether an empty suggestion should be added
 * @param choices An array of available choices
 * @param emptyText The text to use for the empty suggestion. Defaults to an empty string
 * @param emptyValue The value to use for the empty suggestion. Defaults to `null`
 * @param limitChoicesToValue A boolean indicating whether the initial suggestions should be limited to the currently selected one(s)
 * @param matchSuggestion Optional unless `optionText` is a React element. Function which check wether a choice matches a filter. Must return a boolean.
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

    const getSuggestions = useCallback(
        getSuggestionsFactory({
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

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

interface Options extends UseChoicesOptions {
    choices: any[];
    allowEmpty?: boolean;
    emptyText?: string;
    emptyValue?: any;
    limitChoicesToValue?: boolean;
    matchSuggestion?: (filter: string) => (suggestion: any) => boolean;
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
        : suggestionText.match(
              // We must escape any RegExp reserved characters to avoid errors
              // For example, the filter might contains * which must be escaped as \*
              new RegExp(escapeRegExp(filter), 'i')
          );
};

/**
 * Get the suggestions to display after applying a fuzzy search on the available choices
 *
 * @example
 * getSuggestions({
 *  choices: [{ id: 1, name: 'admin' }, { id: 2, name: 'publisher' }],
 *  optionText: 'name',
 *  optionValue: 'id',
 *  getSuggestionText: choice => choice[optionText],
 * })('pub')
 *
 * Will return [{ id: 2, name: 'publisher' }]
 */
export const getSuggestionsFactory = ({
    choices = [],
    allowEmpty,
    emptyText,
    emptyValue,
    optionText,
    optionValue,
    getChoiceText,
    getChoiceValue,
    limitChoicesToValue,
    matchSuggestion = defaultMatchSuggestion(getChoiceText),
    selectedItem,
    suggestionLimit = 0,
}) => filter => {
    // When we display the suggestions for the first time and the input
    // already has a value, we want to display more choices than just the
    // currently selected one, unless limitChoicesToValue was set to true
    if (
        selectedItem &&
        !Array.isArray(selectedItem) &&
        matchSuggestion(filter, selectedItem)
    ) {
        if (limitChoicesToValue) {
            return limitSuggestions(
                choices.filter(
                    choice =>
                        getChoiceValue(choice) === getChoiceValue(selectedItem)
                ),
                suggestionLimit
            );
        }

        return limitSuggestions(
            removeAlreadySelectedSuggestions(selectedItem, getChoiceValue)(
                choices
            ),
            suggestionLimit
        );
    }

    const filteredChoices = choices.filter(choice =>
        matchSuggestion(filter, choice)
    );

    const finalChoices = limitSuggestions(
        removeAlreadySelectedSuggestions(selectedItem, getChoiceValue)(
            filteredChoices
        ),
        suggestionLimit
    );

    if (allowEmpty) {
        const emptySuggestion = {};
        set(emptySuggestion, optionValue, emptyValue);

        if (typeof optionText !== 'function') {
            set(emptySuggestion, optionText, emptyText);
        }
        return finalChoices.concat(emptySuggestion);
    }

    return finalChoices;
};

const removeAlreadySelectedSuggestions = (
    selectedItem,
    getChoiceValue
) => suggestions => {
    if (!Array.isArray(selectedItem)) {
        return suggestions;
    }

    const selectedValues = selectedItem.map(getChoiceValue);

    return suggestions.filter(
        suggestion => !selectedValues.includes(getChoiceValue(suggestion))
    );
};

const limitSuggestions = (suggestions, limit = 0) => {
    if (Number.isInteger(limit) && limit > 0) {
        return suggestions.slice(0, limit);
    }
    return suggestions;
};
