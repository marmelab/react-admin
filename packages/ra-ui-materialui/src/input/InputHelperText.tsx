import * as React from 'react';
import { isValidElement, ReactElement } from 'react';
import {
    useTranslate,
    ValidationError,
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from 'ra-core';

export const InputHelperText = (props: InputHelperTextProps) => {
    const { helperText, touched, error } = props;
    const translate = useTranslate();

    if (touched && error) {
        if ((error as ValidationErrorMessageWithArgs).message) {
            return <ValidationError error={error} />;
        }
        return <>{error}</>;
    }

    if (helperText === false) {
        return null;
    }

    if (isValidElement(helperText)) {
        return helperText;
    }

    if (typeof helperText === 'string') {
        return <>{translate(helperText, { _: helperText })}</>;
    }

    // Material UI's HelperText cannot reserve space unless we pass a single
    // space as child, which isn't possible when the child is a component.
    // Therefore, we must reserve the space ourselves by passing the same
    // markup as Material UI.
    // @see https://github.com/mui/material-ui/blob/62e439b7022d519ab638d65201e204b59b77f8da/packages/material-ui/src/FormHelperText/FormHelperText.js#L85-L90
    return <span dangerouslySetInnerHTML={defaultInnerHTML} />;
};

const defaultInnerHTML = { __html: '&#8203;' };

export interface InputHelperTextProps {
    helperText?: string | ReactElement | boolean;
    error?: ValidationErrorMessage;
    touched: boolean;
}
