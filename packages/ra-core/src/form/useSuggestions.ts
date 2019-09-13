import { useCallback, isValidElement } from 'react';
import set from 'lodash/set';
import useChoices, { UseChoicesOptions } from './useChoices';
import { useTranslate } from '../i18n';

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
        filter =>
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
            })(filter),
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
