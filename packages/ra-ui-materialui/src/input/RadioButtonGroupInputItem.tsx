import * as React from 'react';
import { forwardRef } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useChoices, ChoicesInputProps } from 'ra-core';

export const RadioButtonGroupInputItem = forwardRef<
    HTMLInputElement,
    RadioButtonGroupInputItemProps
>(
    (
        {
            choice,
            onBlur,
            onChange,
            optionText,
            optionValue,
            source,
            translateChoice,
            value: inputValue,
            ...rest
        },
        ref
    ) => {
        const { getChoiceText, getChoiceValue } = useChoices({
            optionText,
            optionValue,
            translateChoice,
        });
        const label = getChoiceText(choice);
        const value = getChoiceValue(choice);

        const nodeId = `${source}_${value}`;

        const handleChange = (_, isActive) => {
            if (isActive) {
                onChange(value);
                onBlur(undefined);
            }
        };

        return (
            <FormControlLabel
                label={label}
                htmlFor={nodeId}
                control={
                    <Radio
                        {...rest}
                        ref={ref}
                        value={value}
                        id={nodeId}
                        color="primary"
                        checked={inputValue === value}
                        onChange={handleChange}
                    />
                }
            />
        );
    }
);

export type RadioButtonGroupInputItemProps = Omit<
    ChoicesInputProps,
    'choices'
> & {
    choice: any;
    value: any;
};

export default RadioButtonGroupInputItem;
