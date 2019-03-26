export default ({
    choices,
    allowEmpty,
    optionText,
    getSuggestionText,
    optionValue,
    limitChoicesToValue,
}) => (filter) => {
    const filteredChoices = limitChoicesToValue ? choices
        .filter(choice => getSuggestionText(choice)
            .match(new RegExp(filter, 'i'))) : choices;

    if (allowEmpty) {
        const emptySuggestion = typeof optionText === 'function' ? {
            [optionValue]: null,
        } : {
            [optionText]: '',
            [optionValue]: null,
        }

        return filteredChoices.concat(emptySuggestion);
    }

    return filteredChoices;
};
