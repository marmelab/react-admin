import React from 'react';
import { connect } from 'react-redux';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { translate, changeLocale, ViewTitle } from 'react-admin';

import { changeTheme } from './actions';

const styles = {
    label: { width: '10em', display: 'inline-block' },
    button: { margin: '1em' },
};

const Configuration = ({
    theme,
    locale,
    changeTheme,
    changeLocale,
    translate,
}) => (
    <Card>
        <ViewTitle title={translate('pos.configuration')} />
        <CardContent>
            <div style={styles.label}>{translate('pos.theme.name')}</div>
            <Button
                raised
                style={styles.button}
                color={theme === 'light' ? 'primary' : 'default'}
                onClick={() => changeTheme('light')}
            >
                {translate('pos.theme.light')}
            </Button>
            <Button
                raised
                style={styles.button}
                color={theme === 'dark' ? 'primary' : 'default'}
                onClick={() => changeTheme('dark')}
            >
                {translate('pos.theme.dark')}
            </Button>
        </CardContent>
        <CardContent>
            <div style={styles.label}>{translate('pos.language')}</div>
            <Button
                raised
                style={styles.button}
                color={locale === 'en' ? 'primary' : 'default'}
                onClick={() => changeLocale('en')}
            >
                en
            </Button>
            <Button
                raised
                style={styles.button}
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

export default connect(mapStateToProps, {
    changeLocale,
    changeTheme,
})(translate(Configuration));
