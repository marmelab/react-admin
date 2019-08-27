const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export default ({
    choices,
    allowEmpty,
    optionText,
    getSuggestionText,
    optionValue,
    limitChoicesToValue,
}) => filter => {
    const filteredChoices = limitChoicesToValue
        ? choices.filter(choice =>
              getSuggestionText(choice).match(
                  // We must escape any RegExp reserved characters to avoid errors
                  // For example, the filter might contains * which must be escaped as \*
                  new RegExp(escapeRegExp(filter), 'i')
              )
          )
        : choices;

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
