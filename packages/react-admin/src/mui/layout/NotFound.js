import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import HotTub from 'material-ui-icons/HotTub';
import History from 'material-ui-icons/History';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';

import AppBarMobile from './AppBarMobile';
import translate from '../../i18n/translate';

const styles = {
    container: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    containerMobile: {
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '-3em',
    },
    icon: {
        width: '9em',
        height: '9em',
    },
    message: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
        margin: '0 1em',
    },
    toolbar: {
        textAlign: 'center',
        marginTop: '2em',
    },
};

function goBack() {
    history.go(-1);
}

const NotFound = ({ width, translate }) => (
    <div style={width === 1 ? styles.containerMobile : styles.container}>
        {width === 1 && <AppBarMobile />}
        <div style={styles.message}>
            <HotTub style={styles.icon} />
            <h1>{translate('ra.page.not_found')}</h1>
            <div>{translate('ra.message.not_found')}.</div>
        </div>
        <div style={styles.toolbar}>
            <Button
                raised
                label={translate('ra.action.back')}
                icon={<History />}
                onClick={goBack}
            />
        </div>
    </div>
);

NotFound.propTypes = {
    width: PropTypes.number,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withWidth(), translate);

export default enhance(NotFound);
