const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

interface Options {
    choices: any[];
    allowEmpty: boolean;
    optionText: Function | string;
    optionValue: string;
    getSuggestionText: (choice: any) => string;
    limitChoicesToValue: boolean;
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
export default ({
    choices,
    allowEmpty,
    optionText,
    getSuggestionText,
    optionValue,
    limitChoicesToValue,
    selectedItem,
    suggestionLimit = 0,
}: Options) => filter => {
    // When we display the suggestions for the first time and the input
    // already has a value, we want to display more choices than just the
    // currently selected one, unless limitChoicesToValue was set to true
    if (
        selectedItem &&
        !Array.isArray(selectedItem) &&
        filter === getSuggestionText(selectedItem)
    ) {
        if (limitChoicesToValue) {
            return limitSuggestions(
                choices.filter(
                    choice => choice[optionValue] === selectedItem[optionValue]
                ),
                suggestionLimit
            );
        }

        return limitSuggestions(choices, suggestionLimit);
    }

    const filteredChoices = choices.filter(choice =>
        getSuggestionText(choice).match(
            // We must escape any RegExp reserved characters to avoid errors
            // For example, the filter might contains * which must be escaped as \*
            new RegExp(escapeRegExp(filter), 'i')
        )
    );

    if (allowEmpty) {
        const emptySuggestion =
            typeof optionText === 'function'
                ? {
                      [optionValue]: null,
                  }
                : {
                      [optionText]: '',
                      [optionValue]: null,
                  };

        return limitSuggestions(
            removeAlreadySelectedSuggestions(
                selectedItem,
                filteredChoices,
                optionValue
            ),
            suggestionLimit
        ).concat(emptySuggestion);
    }

    return limitSuggestions(
        removeAlreadySelectedSuggestions(
            selectedItem,
            filteredChoices,
            optionValue
        ),
        suggestionLimit
    );
};

const removeAlreadySelectedSuggestions = (
    selectedItem,
    suggestions,
    optionValue
) => {
    if (!Array.isArray(selectedItem)) {
        return suggestions;
    }

    const selectedValues = selectedItem.map(item => item[optionValue]);

    return suggestions.filter(
        suggestion => !selectedValues.includes(suggestion[optionValue])
    );
};

const limitSuggestions = (suggestions, limit = 0) => {
    if (Number.isInteger(limit) && limit > 0) {
        return suggestions.slice(0, limit);
    }
    return suggestions;
};
