import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { useTranslate, changeLocale, Title } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { changeTheme } from './actions';

const useStyles = makeStyles({
    label: { width: '10em', display: 'inline-block' },
    button: { margin: '1em' },
});

const Configuration = () => {
    const translate = useTranslate();
    const classes = useStyles();
    const theme = useSelector(state => state.theme);
    const locale = useSelector(state => state.i18n.locale);
    const dispatch = useDispatch();
    return (
        <Card>
            <Title title={translate('pos.configuration')} />
            <CardContent>
                <div className={classes.label}>
                    {translate('pos.theme.name')}
                </div>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={theme === 'light' ? 'primary' : 'default'}
                    onClick={() => dispatch(changeTheme('light'))}
                >
                    {translate('pos.theme.light')}
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={theme === 'dark' ? 'primary' : 'default'}
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
                    color={locale === 'en' ? 'primary' : 'default'}
                    onClick={() => dispatch(changeLocale('en'))}
                >
                    en
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={locale === 'fr' ? 'primary' : 'default'}
                    onClick={() => dispatch(changeLocale('fr'))}
                >
                    fr
                </Button>
            </CardContent>
        </Card>
    );
};

export default Configuration;
