import * as React from 'react';
import { useController } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useChoices } from 'ra-core';

export const RadioButtonGroupInputItem = ({
    choice,
    optionText,
    optionValue,
    source,
    translateChoice,
    onChange,
}) => {
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });
    const label = getChoiceText(choice);
    const value = getChoiceValue(choice);
    const { field } = useController({
        name: source,
        defaultValue: value,
    });

    const nodeId = `${source}_${value}`;

    return (
        <FormControlLabel
            label={label}
            htmlFor={nodeId}
            control={
                <Radio
                    id={nodeId}
                    color="primary"
                    {...field}
                    onChange={(_, isActive) => isActive && onChange(value)}
                />
            }
        />
    );
};

export default RadioButtonGroupInputItem;
