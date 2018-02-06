import React from 'react';
import { connect } from 'react-redux';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { translate, changeLocale, ViewTitle } from 'react-admin';
import withStyles from 'material-ui/styles/withStyles';
import compose from 'recompose/compose';
import { changeTheme } from './actions';

const styles = {
    label: { width: '10em', display: 'inline-block' },
    button: { margin: '1em' },
};

const Configuration = ({
    classes,
    theme,
    locale,
    changeTheme,
    changeLocale,
    translate,
}) => (
    <Card>
        <ViewTitle title={translate('pos.configuration')} />
        <CardContent>
            <div className={classes.label}>{translate('pos.theme.name')}</div>
            <Button
                variant="raised"
                className={classes.button}
                color={theme === 'light' ? 'primary' : 'default'}
                onClick={() => changeTheme('light')}
            >
                {translate('pos.theme.light')}
            </Button>
            <Button
                variant="raised"
                className={classes.button}
                color={theme === 'dark' ? 'primary' : 'default'}
                onClick={() => changeTheme('dark')}
            >
                {translate('pos.theme.dark')}
            </Button>
        </CardContent>
        <CardContent>
            <div className={classes.label}>{translate('pos.language')}</div>
            <Button
                variant="raised"
                className={classes.button}
                color={locale === 'en' ? 'primary' : 'default'}
                onClick={() => changeLocale('en')}
            >
                en
            </Button>
            <Button
                variant="raised"
                className={classes.button}
                color={locale === 'fr' ? 'primary' : 'default'}
                onClick={() => changeLocale('fr')}
            >
                fr
            </Button>
        </CardContent>
    </Card>
);

const mapStateToProps = state => ({
    theme: state.theme,
    locale: state.locale,
});

export default compose(
    connect(mapStateToProps, {
        changeLocale,
        changeTheme,
    }),
    translate,
    withStyles(styles)
)(Configuration);
