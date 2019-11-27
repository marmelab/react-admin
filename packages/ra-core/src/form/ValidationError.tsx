import React, { FunctionComponent } from 'react';
import {
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from './validate';
import { useTranslate } from '../i18n';

interface Props {
    error: ValidationErrorMessage;
}

const ValidationError: FunctionComponent<Props> = ({ error }) => {
    const translate = useTranslate();

    if ((error as ValidationErrorMessageWithArgs).message) {
        const { message, args } = error as ValidationErrorMessageWithArgs;
        return <>{translate(message, { _: message, ...args })}</>;
    }

    return <>{translate(error as string, { _: error })}</>;
};

export default ValidationError;
