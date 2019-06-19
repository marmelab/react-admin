import React, { SFC } from 'react';
import { useTranslate, ValidationError, ValidationErrorMessage } from 'ra-core';

interface Props {
    helperText?: string;
    error?: ValidationErrorMessage;
    touched: boolean;
}

const InputHelperText: SFC<Props> = ({ helperText, touched, error }) => {
    const translate = useTranslate();

    return touched && error ? (
        <ValidationError error={error} />
    ) : helperText ? (
        <>{translate(helperText, { _: helperText })}</>
    ) : null;
};

export default InputHelperText;
