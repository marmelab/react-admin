import * as React from 'react';
import { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import { useTranslatableContext } from 'ra-core';
import { TranslatebleInputsTab } from './TranslatableInputsTab';
import { AppBarProps } from '../layout';

/**
 * Default language selector for the TranslatableInputs component. Generates a tab for each specified language.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabs = ({
    formGroupKeyPrefix,
    TabsProps: tabsProps,
}: TranslatableInputsTabsProps & AppBarProps): ReactElement => {
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
                    <TranslatebleInputsTab
                        key={locale}
                        value={locale}
                        locale={locale}
                        formGroupKeyPrefix={formGroupKeyPrefix}
                    />
                ))}
            </Tabs>
        </AppBar>
    );
};

export interface TranslatableInputsTabsProps {
    formGroupKeyPrefix?: string;
    TabsProps?: TabsProps;
}
