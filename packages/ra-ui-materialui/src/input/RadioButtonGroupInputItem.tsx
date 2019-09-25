import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { useChoices } from 'ra-core';

const RadioButtonGroupInputItem = ({
    choice,
    optionText,
    optionValue,
    source,
    translateChoice,
}) => {
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });

    const choiceName = getChoiceText(choice);
    const nodeId = `${source}_${getChoiceValue(choice)}`;

    return (
        <FormControlLabel
            htmlFor={nodeId}
            value={getChoiceValue(choice)}
            control={<Radio id={nodeId} color="primary" />}
            label={choiceName}
        />
    );
};

export default RadioButtonGroupInputItem;
