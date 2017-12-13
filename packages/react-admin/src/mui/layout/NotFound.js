import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import HotTub from 'material-ui-icons/HotTub';
import History from 'material-ui-icons/History';
import { withStyles } from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';
import compose from 'recompose/compose';
import classnames from 'classnames';

import AppBarMobile from './AppBarMobile';
import translate from '../../i18n/translate';

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        [theme.breakpoints.up('md')]: {
            height: '100%',
        },
        [theme.breakpoints.down('md')]: {
            height: '100vh',
            marginTop: '-3em',
        },
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
});

function goBack() {
    history.go(-1);
}

const NotFound = ({ classes, className, translate, title, ...rest }) => (
    <div className={classnames(classes.container, className)} {...rest}>
        <Hidden mdUp>
            <AppBarMobile title={title} />
        </Hidden>
        <div className={classes.message}>
            <HotTub className={classes.icon} />
            <h1>{translate('ra.page.not_found')}</h1>
            <div>{translate('ra.message.not_found')}.</div>
        </div>
        <div className={classes.toolbar}>
            <Button raised icon={<History />} onClick={goBack}>
                {translate('ra.action.back')}
            </Button>
        </div>
    </div>
);

NotFound.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(NotFound);
