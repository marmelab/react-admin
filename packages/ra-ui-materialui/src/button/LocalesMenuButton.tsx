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
 * @example
 *
 *     const MyAppBar: FC = props => (
 *         <AppBar {...props}>
 *             <Box flex="1">
 *                 <Typography variant="h6" id="react-admin-title"></Typography>
 *             </Box>
 *             <LocalesMenuButton
 *                 languages={[
 *                     { locale: 'en', name: 'English' },
 *                     { locale: 'fr', name: 'Français' },
 *                 ]}
 *             />
 *         </AppBar>
 *     );
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
        <Root>
            <Button
                color="inherit"
                aria-controls="simple-menu"
                aria-label=""
                aria-haspopup="true"
                onClick={handleLanguageClick}
            >
                <LanguageIcon />
                <div className={LocalesMenuButtonClasses.selectedLanguage}>
                    {getNameForLocale(locale)}
                </div>
                <ExpandMoreIcon fontSize="small" />
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

export const LocalesMenuButtonClasses = {
    selectedLanguage: `${PREFIX}-selectedLanguage`,
};

const Root = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${LocalesMenuButtonClasses.selectedLanguage}`]: {
        marginLeft: theme.spacing(1),
    },
}));

export interface LocalesMenuButtonProps {
    languages?: { locale: string; name: string }[];
}
