import React from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';
import { useTranslate } from 'ra-core';
import { capitalize } from 'inflection';

/**
 * Single tab that selects a locale in a TranslatableFields component.
 * @see TranslatableFields
 */
export const TranslatableFieldsTab = (
    props: TranslatableFieldsTabProps & TabProps
) => {
    const { locale, groupKey = '', ...rest } = props;
    const translate = useTranslate();

    return (
        <Tab
            id={`translatable-header-${groupKey}${locale}`}
            label={translate(`ra.locales.${groupKey}${locale}`, {
                _: capitalize(locale),
            })}
            {...rest}
        />
    );
};

interface TranslatableFieldsTabProps {
    locale: string;
    groupKey?: string;
}
