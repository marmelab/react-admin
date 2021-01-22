import React from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';
import { useTranslate } from 'ra-core';
import { capitalize } from 'inflection';

/**
 * Single tab which select a locale in a TranslatableFields component.
 * @see TranslatableFields
 */
export const TranslatableFieldsTab = (
    props: TranslatableFieldsTabProps & TabProps
) => {
    const { locale, groupPrefix = '', ...rest } = props;
    const translate = useTranslate();

    return (
        <Tab
            id={`translatable-header-${groupPrefix}${locale}`}
            label={translate(`ra.locales.${groupPrefix}${locale}`, {
                _: capitalize(locale),
            })}
            {...rest}
        />
    );
};

interface TranslatableFieldsTabProps {
    locale: string;
    groupPrefix?: string;
}
