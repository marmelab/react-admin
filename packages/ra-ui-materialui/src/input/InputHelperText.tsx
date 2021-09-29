import * as React from 'react';
import { useTranslate, ValidationError, ValidationErrorMessage } from 'ra-core';

export interface InputHelperTextProps {
    helperText?: string | boolean;
    error?: ValidationErrorMessage;
    touched: boolean;
}

const InputHelperText = (props: InputHelperTextProps) => {
    const { helperText, touched, error } = props;
    const translate = useTranslate();

    return touched && error ? (
        <ValidationError error={error} />
    ) : typeof helperText === 'string' ? (
        <>{translate(helperText, { _: helperText })}</>
    ) : helperText !== false ? (
        // material-ui's HelperText cannot reserve space unless we pass a single
        // space as child, which isn't possible when the child is a component.
        // Therefore, we must reserve the space ourselves by passing the same
        // markup as material-ui.
        // @see https://github.com/mui-org/material-ui/blob/62e439b7022d519ab638d65201e204b59b77f8da/packages/material-ui/src/FormHelperText/FormHelperText.js#L85-L90
        // eslint-disable-next-line react/no-danger
        <span dangerouslySetInnerHTML={defaultInnerHTML} />
    ) : null;
};

const defaultInnerHTML = { __html: '&#8203;' };

export default InputHelperText;
