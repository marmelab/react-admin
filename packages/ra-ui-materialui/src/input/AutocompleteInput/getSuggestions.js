const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export default ({
    choices,
    allowEmpty,
    optionText,
    getSuggestionText,
    optionValue,
    limitChoicesToValue,
    initialSelectedItem,
}) => filter => {
    // This is the first display case when the input already has a value.
    // Unless limitChoicesToValue was set to true, we want to display more
    // choices than just the currently selected one
    if (
        initialSelectedItem &&
        filter === getSuggestionText(initialSelectedItem)
    ) {
        if (limitChoicesToValue) {
            return choices.filter(
                choice =>
                    choice[optionValue] === initialSelectedItem[optionValue]
            );
        }

        return choices;
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

        return filteredChoices.concat(emptySuggestion);
    }

    return filteredChoices;
};
