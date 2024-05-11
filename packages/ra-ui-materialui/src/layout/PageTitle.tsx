import * as React from 'react';
import { useTranslate } from 'ra-core';

export const PageTitle = ({ title, defaultTitle, className, ...rest }: any) => {
    const translate = useTranslate();

    return (
        <span className={className}>
            {!title ? (
                <span {...rest}>{defaultTitle}</span>
            ) : typeof title === 'string' ? (
                <span {...rest}>{translate(title, { _: title })}</span>
            ) : (
                title
            )}
        </span>
    );
};
