import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/material/styles';
import { useChoices } from 'ra-core';

const useStyles = makeStyles(
    {
        checkbox: {
            height: 32,
        },
    },
    { name: 'RaCheckboxGroupInputItem' }
);

const CheckboxGroupInputItem = props => {
    const {
        classes: classesOverride,
        id,
        choice,
        onChange,
        optionText,
        optionValue,
        options,
        translateChoice,
        value,
        ...rest
    } = props;
    const classes = useStyles(props);
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
                    {...options}
                    {...rest}
                />
            }
            label={choiceName}
        />
    );
};

export default CheckboxGroupInputItem;
