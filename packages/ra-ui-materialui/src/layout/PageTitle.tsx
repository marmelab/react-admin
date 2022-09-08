import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
    useStore,
    useRenderTemplate,
    useRecordContext,
    useTranslate,
} from 'ra-core';

export const PageTitle = React.forwardRef<HTMLSpanElement, any>(
    ({ title, defaultTitle, className, preferenceKey, ...rest }, ref) => {
        const { pathname } = useLocation();
        const [titleFromPreferences] = useStore(
            `preferences.${preferenceKey || pathname}.title`
        );
        const translate = useTranslate();
        const renderTemplate = useRenderTemplate();
        const record = useRecordContext();

        return titleFromPreferences ? (
            <span className={className} ref={ref} {...rest}>
                {renderTemplate(titleFromPreferences, record, defaultTitle)}
            </span>
        ) : (
            <span className={className} ref={ref}>
                {!title ? (
                    <span {...rest}>{defaultTitle}</span>
                ) : typeof title === 'string' ? (
                    <span {...rest}>{translate(title, { _: title })}</span>
                ) : (
                    title
                )}
            </span>
        );
    }
);
