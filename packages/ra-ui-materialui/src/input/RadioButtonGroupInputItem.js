import React, { isValidElement, cloneElement } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import get from 'lodash/get';
import { useTranslate } from 'ra-core';

const RadioButtonGroupInputItem = ({
    choice,
    optionText,
    optionValue,
    source,
    translateChoice,
}) => {
    const translate = useTranslate();

    const choiceName = isValidElement(optionText) // eslint-disable-line no-nested-ternary
        ? cloneElement(optionText, { record: choice })
        : typeof optionText === 'function'
        ? optionText(choice)
        : get(choice, optionText);

    const nodeId = `${source}_${get(choice, optionValue)}`;

    return (
        <FormControlLabel
            htmlFor={nodeId}
            value={get(choice, optionValue)}
            control={<Radio id={nodeId} color="primary" />}
            label={
                translateChoice
                    ? translate(choiceName, { _: choiceName })
                    : choiceName
            }
        />
    );
};

export default RadioButtonGroupInputItem;
