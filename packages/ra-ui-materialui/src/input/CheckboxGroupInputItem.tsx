import React from 'react';
import get from 'lodash/get';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles({
    checkbox: {
        height: 32,
    },
});

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
    const translate = useTranslate();

    const choiceName = React.isValidElement<{ record: any }>(optionText)
        ? React.cloneElement<{ record: any }>(optionText, { record: choice })
        : typeof optionText === 'function'
        ? optionText(choice)
        : get(choice, optionText);

    return (
        <FormControlLabel
            htmlFor={`${id}_${get(choice, optionValue)}`}
            key={get(choice, optionValue)}
            onChange={onChange}
            control={
                <Checkbox
                    id={`${id}_${get(choice, optionValue)}`}
                    color="primary"
                    className={classes.checkbox}
                    checked={
                        value
                            ? value.find(
                                  v => v == get(choice, optionValue) // eslint-disable-line eqeqeq
                              ) !== undefined
                            : false
                    }
                    value={String(get(choice, optionValue))}
                    {...rest}
                />
            }
            label={
                translateChoice
                    ? translate(choiceName, { _: choiceName })
                    : choiceName
            }
        />
    );
};

export default CheckboxGroupInputItem;
