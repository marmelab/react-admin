import * as React from 'react';
import { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import { useTranslatableContext } from 'ra-core';
import { TranslatableFieldsTab } from './TranslatableFieldsTab';
import { AppBarProps } from '../layout';

/**
 * Default language selector for the TranslatableFields component. Generates a tab for each specified language.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabs = ({
    TabsProps: tabsProps,
}: LanguagesTabsProps & AppBarProps): ReactElement => {
    const {
        languages,
        selectLanguage,
        selectedLanguage,
    } = useTranslatableContext();

    const handleChange = (event, newLanguage): void => {
        selectLanguage(newLanguage);
    };

    return (
        <AppBar position="static">
            <Tabs
                value={selectedLanguage}
                onChange={handleChange}
                {...tabsProps}
            >
                {languages.map(locale => (
                    <TranslatableFieldsTab
                        key={locale}
                        value={locale}
                        locale={locale}
                    />
                ))}
            </Tabs>
        </AppBar>
    );
};

export interface LanguagesTabsProps {
    TabsProps?: TabsProps;
}
