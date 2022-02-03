import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useTranslate, useLocaleState, useTheme, Title } from 'react-admin';
import { darkTheme, lightTheme } from '../layout/themes';

const PREFIX = 'Configuration';

const classes = {
    label: `${PREFIX}-label`,
    button: `${PREFIX}-button`,
};

const StyledCard = styled(Card, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${classes.label}`]: { width: '10em', display: 'inline-block' },
    [`& .${classes.button}`]: { margin: '1em' },
});

const Configuration = () => {
    const translate = useTranslate();
    const [locale, setLocale] = useLocaleState();
    const [theme, setTheme] = useTheme();

    return (
        <StyledCard>
            <Title title={translate('pos.configuration')} />
            <CardContent>
                <div className={classes.label}>
                    {translate('pos.theme.name')}
                </div>
                <Button
                    variant="contained"
                    className={classes.button}
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
                    className={classes.button}
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
                <div className={classes.label}>{translate('pos.language')}</div>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={locale === 'en' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('en')}
                >
                    en
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={locale === 'fr' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('fr')}
                >
                    fr
                </Button>
            </CardContent>
        </StyledCard>
    );
};

export default Configuration;
