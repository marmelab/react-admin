import * as React from 'react';
import {
    useStore,
    useRecordContext,
    useTranslate,
    usePreferenceKey,
} from 'ra-core';

export const PageTitle = ({ title, defaultTitle, className, ...rest }: any) => {
    const preferenceKey = usePreferenceKey();
    const [titleFromPreferences] = useStore(preferenceKey);
    const translate = useTranslate();
    const record = useRecordContext();

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
