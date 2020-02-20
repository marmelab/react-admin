import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { useChoices } from 'ra-core';

const useStyles = makeStyles(
    {
        checkbox: {
            height: 32,
        },
    },
    { name: 'RaCheckboxGroupInputItem' }
);

const CheckboxGroupInputItem = ({
    id,
    choice,
    onChange,
    optionText,
    optionValue,
    translateChoice,
    value,
    ...rest
}) => {
    const classes = useStyles({});
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });

    const choiceName = getChoiceText(choice);

    return (
        <FormControlLabel
            htmlFor={`${id}_${getChoiceValue(choice)}`}
            key={getChoiceValue(choice)}
            onChange={onChange}
            control={
                <Checkbox
                    id={`${id}_${getChoiceValue(choice)}`}
                    color="primary"
                    className={classes.checkbox}
                    checked={
                        value
                            ? value.find(v => v == getChoiceValue(choice)) !== // eslint-disable-line eqeqeq
                              undefined
                            : false
                    }
                    value={String(getChoiceValue(choice))}
                    {...rest}
                />
            }
            label={choiceName}
        />
    );
};

export default CheckboxGroupInputItem;
