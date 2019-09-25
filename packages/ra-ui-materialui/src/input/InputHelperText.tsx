import React, { FunctionComponent } from 'react';
import { useTranslate, ValidationError, ValidationErrorMessage } from 'ra-core';

interface Props {
    helperText?: string;
    error?: ValidationErrorMessage;
    touched: boolean;
}

const InputHelperText: FunctionComponent<Props> = ({
    helperText,
    touched,
    error,
}) => {
    const translate = useTranslate();

    return touched && error ? (
        <ValidationError error={error} />
    ) : helperText ? (
        <>{translate(helperText, { _: helperText })}</>
    ) : null;
};

export default InputHelperText;
