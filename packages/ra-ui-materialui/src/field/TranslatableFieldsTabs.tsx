import * as React from 'react';
import { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import { useTranslatableContext } from 'ra-core';
import { TranslatableFieldsTab } from './TranslatableFieldsTab';
import { AppBarProps } from '../layout';

/**
 * Default locale selector for the TranslatableFields component. Generates a tab for each specified locale.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabs = ({
    groupKey,
    TabsProps: tabsProps,
}: TranslatableFieldsTabsProps & AppBarProps): ReactElement => {
    const { locales, selectLocale, selectedLocale } = useTranslatableContext();

    const handleChange = (event, newLocale): void => {
        selectLocale(newLocale);
    };

    return (
        <AppBar position="static">
            <Tabs value={selectedLocale} onChange={handleChange} {...tabsProps}>
                {locales.map(locale => (
                    <TranslatableFieldsTab
                        key={locale}
                        value={locale}
                        locale={locale}
                        groupKey={groupKey}
                    />
                ))}
            </Tabs>
        </AppBar>
    );
};

export interface TranslatableFieldsTabsProps {
    TabsProps?: TabsProps;
    groupKey?: string;
}
