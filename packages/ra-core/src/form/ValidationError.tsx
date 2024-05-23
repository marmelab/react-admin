import * as React from 'react';
import {
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from './validate';
import { useTranslate } from '../i18n';

export interface ValidationErrorProps {
    error: ValidationErrorMessage;
}

const ValidationErrorSpecialFormatPrefix = '@@react-admin@@';
const ValidationError = (props: ValidationErrorProps) => {
    const { error } = props;
    let errorMessage = error;
    const translate = useTranslate();
    // react-hook-form expects errors to be plain strings but our validators can return objects
    // that have message and args.
    // To avoid double translation for users that validate with a schema instead of our validators
    // we use a special format for our validators errors.
    // The useInput hook handle the special formatting
    if (
        typeof error === 'string' &&
        error.startsWith(ValidationErrorSpecialFormatPrefix)
    ) {
        errorMessage = JSON.parse(
            error.substring(ValidationErrorSpecialFormatPrefix.length)
        );
    }
    if ((errorMessage as ValidationErrorMessageWithArgs).message) {
        const { message, args } =
            errorMessage as ValidationErrorMessageWithArgs;
        return <>{translate(message, { _: message, ...args })}</>;
    }

    return <>{translate(errorMessage as string, { _: errorMessage })}</>;
};

export default ValidationError;
