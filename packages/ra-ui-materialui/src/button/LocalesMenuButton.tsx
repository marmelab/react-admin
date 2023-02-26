import * as React from 'react';
import { MouseEvent, useState } from 'react';
import { useLocaleState, useLocales } from 'ra-core';
import { Box, Button, Menu, MenuItem, styled } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Translate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Language selector. Changes the locale in the app and persists it in
 * preferences so that the app opens with the right locale in the future.
 *
 * Uses i18nProvider.getLocales() to get the list of available locales.
 *
 * @example
 * import { AppBar, TitlePortal, LocalesMenuButton } from 'react-admin';
 *
 * const MyAppBar = () => (
 *     <AppBar>
 *         <TitlePortal />
 *         <LocalesMenuButton />
 *     </AppBar>
 * );
 */
export const LocalesMenuButton = (props: LocalesMenuButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const languages = useLocales({ locales: props.languages });
    const [locale, setLocale] = useLocaleState();

    const getNameForLocale = (locale: string): string => {
        const language = languages.find(language => language.locale === locale);
        return language ? language.name : '';
    };

    const changeLocale = (locale: string) => (): void => {
        setLocale(locale);
        setAnchorEl(null);
    };

    const handleLanguageClick = (event: MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    return (
        <Root component="span">
            <Button
                color="inherit"
                aria-controls="simple-menu"
                aria-label=""
                aria-haspopup="true"
                onClick={handleLanguageClick}
                startIcon={<LanguageIcon />}
                endIcon={<ExpandMoreIcon fontSize="small" />}
            >
                {getNameForLocale(locale)}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {languages.map(language => (
                    <MenuItem
                        key={language.locale}
                        onClick={changeLocale(language.locale)}
                        selected={language.locale === locale}
                    >
                        {language.name}
                    </MenuItem>
                ))}
            </Menu>
        </Root>
    );
};

const PREFIX = 'RaLocalesMenuButton';

export const LocalesMenuButtonClasses = {};

const Root = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

export interface LocalesMenuButtonProps {
    languages?: { locale: string; name: string }[];
}
