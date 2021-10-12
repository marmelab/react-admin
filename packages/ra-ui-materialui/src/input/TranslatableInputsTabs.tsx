import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import { AppBar, Tabs, TabsProps } from '@mui/material';
import { useTranslatableContext } from 'ra-core';
import { TranslatableInputsTab } from './TranslatableInputsTab';
import { AppBarProps } from '../layout';

const PREFIX = 'RaTranslatableInputsTabs';

const classes = {
    root: `${PREFIX}-root`,
    tabs: `${PREFIX}-tabs`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    [`&.${classes.root}`]: {
        boxShadow: 'none',
        borderRadius: 0,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
    },

    [`& .${classes.tabs}`]: {
        minHeight: theme.spacing(3),
    },
}));

/**
 * Default locale selector for the TranslatableInputs component. Generates a tab for each specified locale.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabs = (
    props: TranslatableInputsTabsProps & AppBarProps
): ReactElement => {
    const { groupKey, TabsProps: tabsProps } = props;
    const { locales, selectLocale, selectedLocale } = useTranslatableContext();

    const handleChange = (event, newLocale): void => {
        selectLocale(newLocale);
    };

    return (
        <StyledAppBar
            color="default"
            position="static"
            className={classes.root}
        >
            <Tabs
                value={selectedLocale}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                className={classes.tabs}
                {...tabsProps}
            >
                {locales.map(locale => (
                    <TranslatableInputsTab
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

export interface TranslatableInputsTabsProps {
    groupKey?: string;
    TabsProps?: TabsProps;
}
