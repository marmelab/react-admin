import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { AppBar, type AppBarProps, Tabs, type TabsProps } from '@mui/material';
import { useTranslatableContext } from 'ra-core';
import { TranslatableInputsTab } from './TranslatableInputsTab';

/**
 * Default locale selector for the TranslatableInputs component. Generates a tab for each specified locale.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabs = (
    inProps: TranslatableInputsTabsProps & AppBarProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { groupKey, TabsProps: tabsProps } = props;
    const { locales, selectLocale, selectedLocale } = useTranslatableContext();

    const handleChange = (event, newLocale): void => {
        selectLocale(newLocale);
    };

    return (
        <StyledAppBar
            color="default"
            position="static"
            className={TranslatableInputsTabsClasses.root}
        >
            <Tabs
                value={selectedLocale}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                className={TranslatableInputsTabsClasses.tabs}
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

const PREFIX = 'RaTranslatableInputsTabs';

export const TranslatableInputsTabsClasses = {
    root: `${PREFIX}-root`,
    tabs: `${PREFIX}-tabs`,
};

const StyledAppBar = styled(AppBar, { name: PREFIX })(({ theme }) => ({
    [`&.${TranslatableInputsTabsClasses.root}`]: {
        boxShadow: 'none',
        borderRadius: 0,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
    },

    [`& .${TranslatableInputsTabsClasses.tabs}`]: {
        minHeight: theme.spacing(3),
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaTranslatableInputsTabs: 'root' | 'tabs';
    }

    interface ComponentsPropsList {
        RaTranslatableInputsTabs: Partial<TranslatableInputsTabsProps>;
    }

    interface Components {
        RaTranslatableInputsTabs?: {
            defaultProps?: ComponentsPropsList['RaTranslatableInputsTabs'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaTranslatableInputsTabs'];
        };
    }
}
