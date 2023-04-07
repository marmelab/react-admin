import * as React from 'react';
import {
    useRecordContext,
    useTranslate,
    usePreference,
    RaRecord,
} from 'ra-core';

export const PageTitle = ({ title, defaultTitle, className, ...rest }: any) => {
    const [titleFromPreferences] = usePreference();
    const translate = useTranslate();
    const record = useRecordContext<RaRecord>();

    return titleFromPreferences ? (
        <span className={className} {...rest}>
            {translate(titleFromPreferences, {
                ...record,
                _: titleFromPreferences,
            })}
        </span>
    ) : (
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
