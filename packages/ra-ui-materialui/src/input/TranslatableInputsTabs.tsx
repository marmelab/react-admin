import * as React from 'react';
import { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import { useTranslatableContext } from 'ra-core';
import { TranslatebleInputsTab } from './TranslatableInputsTab';
import { AppBarProps } from '../layout';

/**
 * Default locale selector for the TranslatableInputs component. Generates a tab for each specified locale.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabs = ({
    groupKey,
    TabsProps: tabsProps,
}: TranslatableInputsTabsProps & AppBarProps): ReactElement => {
    const { locales, selectLocale, selectedLocale } = useTranslatableContext();

    const handleChange = (event, newLocale): void => {
        selectLocale(newLocale);
    };

    return (
        <AppBar position="static">
            <Tabs value={selectedLocale} onChange={handleChange} {...tabsProps}>
                {locales.map(locale => (
                    <TranslatebleInputsTab
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

export interface TranslatableInputsTabsProps {
    groupKey?: string;
    TabsProps?: TabsProps;
}
