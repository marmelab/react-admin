import React, { FunctionComponent } from 'react';
import {
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from './validate';
import { useTranslate } from '../i18n';
import { Translate } from '../types';

interface Props {
    error: ValidationErrorMessage;
}

const translateArrayArgValue = (translate: Translate, values: any[]) =>
    values
        .map(value => translate(value.toString(), { _: value.toString() }))
        .join(', ');

const translateArgValue = (translate: Translate, argValue: any) => {
    if (Array.isArray(argValue)) {
        return translateArrayArgValue(translate, argValue);
    }

    return translate(argValue.toString(), { _: argValue.toString() });
};

const translateArgs = (translate: Translate, args: { [key: string]: any }) =>
    Object.keys(args).reduce(
        (acc, key) => ({
            ...acc,
            [key]: translateArgValue(translate, args[key]),
        }),
        {}
    );

const ValidationError: FunctionComponent<Props> = ({ error }) => {
    const translate = useTranslate();

    if ((error as ValidationErrorMessageWithArgs).message) {
        const { message, args } = error as ValidationErrorMessageWithArgs;
        const { _, ...allArgsButDefault } = args;

        const translatedArgs = translateArgs(translate, allArgsButDefault);

        return <>{translate(message, translatedArgs)}</>;
    }

    return <>{translate(error as string, { _: error })}</>;
};

export default ValidationError;
