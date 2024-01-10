import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useChoices } from 'ra-core';

export const CheckboxGroupInputItem = props => {
    const {
        id,
        choice,
        className,
        fullWidth,
        onChange,
        optionText,
        optionValue,
        options,
        translateChoice,
        value,
        labelPlacement,
        inputRef,
        ...rest
    } = props;

    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });

    const choiceName = getChoiceText(choice);

    return (
        <StyledFormControlLabel
            htmlFor={`${id}_${getChoiceValue(choice)}`}
            key={getChoiceValue(choice)}
            onChange={onChange}
            className={className}
            inputRef={inputRef}
            control={
                <Checkbox
                    id={`${id}_${getChoiceValue(choice)}`}
                    color="primary"
                    className={CheckboxGroupInputItemClasses.checkbox}
                    checked={
                        value
                            ? value.find(v => v == getChoiceValue(choice)) !== // eslint-disable-line eqeqeq
                              undefined
                            : false
                    }
                    value={String(getChoiceValue(choice))}
                    {...options}
                    {...rest}
                />
            }
            label={choiceName}
            labelPlacement={labelPlacement}
        />
    );
};

const PREFIX = 'RaCheckboxGroupInputItem';

export const CheckboxGroupInputItemClasses = {
    checkbox: `${PREFIX}-checkbox`,
};

const StyledFormControlLabel = styled(FormControlLabel, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${CheckboxGroupInputItemClasses.checkbox}`]: {
        height: 32,
    },
});
