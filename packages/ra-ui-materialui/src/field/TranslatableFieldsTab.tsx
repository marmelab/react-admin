import React from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';
import { useTranslate } from 'ra-core';
import { capitalize } from 'inflection';

/**
 * Single tab which select a language TranslatableFields component.
 * @see TranslatableFields
 */
export const TranslatableFieldsTab = (
    props: TranslatableFieldsTabProps & TabProps
) => {
    const { locale, ...rest } = props;
    const translate = useTranslate();

    return (
        <Tab
            label={translate(`ra.languages.${locale}`, {
                _: capitalize(locale),
            })}
            {...rest}
        />
    );
};

interface TranslatableFieldsTabProps {
    locale: string;
}
