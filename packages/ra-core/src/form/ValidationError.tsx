import React, { SFC } from 'react';
import {
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from './validate';
import { useTranslate } from '../i18n';

interface Props {
    error: ValidationErrorMessage;
}

const ValidationError: SFC<Props> = ({ error }) => {
    const translate = useTranslate();

    if ((error as ValidationErrorMessageWithArgs).message) {
        const { message, args } = error as ValidationErrorMessageWithArgs;
        const { _, ...allArgsButDefault } = args;

        const translatedArgs = Object.keys(allArgsButDefault).reduce(
            (acc, key) => {
                const arg = Array.isArray(allArgsButDefault[key])
                    ? allArgsButDefault[key]
                          .map(item =>
                              translate(item.toString(), { _: item.toString() })
                          )
                          .join(', ')
                    : allArgsButDefault[key].toString();

                return {
                    ...acc,
                    [key]: translate(arg.toString(), { _: arg.toString() }),
                };
            },
            {}
        );

        return <>{translate(message, translatedArgs)}</>;
    }

    return <>{translate(error as string, { _: error })}</>;
};

export default ValidationError;
