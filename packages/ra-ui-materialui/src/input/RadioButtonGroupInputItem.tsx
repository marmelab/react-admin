import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useChoices } from 'ra-core';

export const RadioButtonGroupInputItem = ({
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
    const label = getChoiceText(choice);
    const value = getChoiceValue(choice);

    const nodeId = `${source}_${value}`;

    return (
        <FormControlLabel
            label={label}
            htmlFor={nodeId}
            value={value}
            control={<Radio id={nodeId} color="primary" />}
        />
    );
};

export default RadioButtonGroupInputItem;
