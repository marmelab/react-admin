import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useTranslate, useLocale, useSetLocale, Title } from 'react-admin';
import { changeTheme } from './actions';
import { AppState } from '../types';

const PREFIX = 'Configuration';

const classes = {
    label: `${PREFIX}-label`,
    button: `${PREFIX}-button`,
};

const StyledCard = styled(Card)({
    [`& .${classes.label}`]: { width: '10em', display: 'inline-block' },
    [`& .${classes.button}`]: { margin: '1em' },
});

const Configuration = () => {
    const translate = useTranslate();
    const locale = useLocale();
    const setLocale = useSetLocale();

    const theme = useSelector((state: AppState) => state.theme);
    const dispatch = useDispatch();
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
                    color={theme === 'light' ? 'primary' : 'secondary'}
                    onClick={() => dispatch(changeTheme('light'))}
                >
                    {translate('pos.theme.light')}
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={theme === 'dark' ? 'primary' : 'secondary'}
                    onClick={() => dispatch(changeTheme('dark'))}
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
