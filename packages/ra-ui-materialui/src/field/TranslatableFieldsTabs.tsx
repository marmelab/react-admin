import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import { useTranslatableContext } from 'ra-core';
import { TranslatableFieldsTab } from './TranslatableFieldsTab';
import { AppBarProps } from '../layout';

/**
 * Default locale selector for the TranslatableFields component. Generates a tab for each specified locale.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabs = (
    props: TranslatableFieldsTabsProps & AppBarProps
): ReactElement => {
    const { groupKey, TabsProps: tabsProps, className } = props;
    const { locales, selectLocale, selectedLocale } = useTranslatableContext();

    const handleChange = (event, newLocale): void => {
        selectLocale(newLocale);
    };

    return (
        <StyledAppBar color="default" position="static" className={className}>
            <Tabs
                value={selectedLocale}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                {...tabsProps}
            >
                {locales.map(locale => (
                    <TranslatableFieldsTab
                        key={locale}
                        value={locale}
                        locale={locale}
                        groupKey={groupKey}
                    />
                ))}
            </Tabs>
        </StyledAppBar>
    );
};

export interface TranslatableFieldsTabsProps {
    TabsProps?: TabsProps;
    groupKey?: string;
}

const PREFIX = 'RaTranslatableFieldsTabs';

const StyledAppBar = styled(AppBar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    boxShadow: 'none',
    borderRadius: 0,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
}));
