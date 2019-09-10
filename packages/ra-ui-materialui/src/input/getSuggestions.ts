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
    // This is the first display case when the input already has a value.
    // Unless limitChoicesToValue was set to true, we want to display more
    // choices than just the currently selected one
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
                filteredChoices.concat(emptySuggestion),
                optionValue
            ),
            suggestionLimit
        );
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
