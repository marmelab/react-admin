import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { AppBar, type AppBarProps, Tabs, type TabsProps } from '@mui/material';
import { useTranslatableContext } from 'ra-core';
import { TranslatableFieldsTab } from './TranslatableFieldsTab';

/**
 * Default locale selector for the TranslatableFields component. Generates a tab for each specified locale.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabs = (
    inProps: TranslatableFieldsTabsProps & AppBarProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
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
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaTranslatableFieldsTabs: 'root';
    }

    interface ComponentsPropsList {
        RaTranslatableFieldsTabs: Partial<TranslatableFieldsTabsProps>;
    }

    interface Components {
        RaTranslatableFieldsTabs?: {
            defaultProps?: ComponentsPropsList['RaTranslatableFieldsTabs'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaTranslatableFieldsTabs'];
        };
    }
}
