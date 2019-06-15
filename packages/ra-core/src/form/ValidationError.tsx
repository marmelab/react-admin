import React, { SFC } from 'react';
import { ValidationError, ValidationErrorMessage } from './validate';
import { useTranslate } from '../i18n';

interface Props {
    error: ValidationError;
};

const Error: SFC<Props> = ({ error }) => {
    const translate = useTranslate();

    if ((error as ValidationErrorMessage).message) {
        const { message, args } = error as ValidationErrorMessage;
        const { _, ...allArgsButDefault } = args;

        const translatedArgs = Object
            .keys(allArgsButDefault)
            .reduce((acc, key) => {
                const arg = Array.isArray(allArgsButDefault[key])
                    ? allArgsButDefault[key]
                        .map(item =>translate(item, { _: item.toString() }))
                        .join(', ')
                    : allArgsButDefault[key];

                return ({
                    ...acc,
                    [key]: translate(arg, { _: arg.toString() }),
                });
            }, {});

        return <>{translate(message, translatedArgs)}</>;
    } 
    
    return <>{translate(error as string, { _: error })}</>;
};

export default Error;