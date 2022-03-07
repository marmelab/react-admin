import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useTranslate, useLocaleState, useTheme, Title } from 'react-admin';

import { darkTheme, lightTheme } from '../layout/themes';

const Configuration = () => {
    const translate = useTranslate();
    const [locale, setLocale] = useLocaleState();
    const [theme, setTheme] = useTheme();

    return (
        <Card>
            <Title title={translate('pos.configuration')} />
            <CardContent>
                <Box sx={{ width: '10em', display: 'inline-block' }}>
                    {translate('pos.theme.name')}
                </Box>
                <Button
                    variant="contained"
                    sx={{ margin: '1em' }}
                    color={
                        theme?.palette?.mode === 'light'
                            ? 'primary'
                            : 'secondary'
                    }
                    onClick={() => setTheme(lightTheme)}
                >
                    {translate('pos.theme.light')}
                </Button>
                <Button
                    variant="contained"
                    sx={{ margin: '1em' }}
                    color={
                        theme?.palette?.mode === 'dark'
                            ? 'primary'
                            : 'secondary'
                    }
                    onClick={() => setTheme(darkTheme)}
                >
                    {translate('pos.theme.dark')}
                </Button>
            </CardContent>
            <CardContent>
                <Box sx={{ width: '10em', display: 'inline-block' }}>
                    {translate('pos.language')}
                </Box>
                <Button
                    variant="contained"
                    sx={{ margin: '1em' }}
                    color={locale === 'en' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('en')}
                >
                    en
                </Button>
                <Button
                    variant="contained"
                    sx={{ margin: '1em' }}
                    color={locale === 'fr' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('fr')}
                >
                    fr
                </Button>
            </CardContent>
        </Card>
    );
};

export default Configuration;
