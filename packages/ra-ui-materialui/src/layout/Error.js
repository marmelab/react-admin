import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Report';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import History from '@material-ui/icons/History';

import AppBarMobile from './AppBarMobile';
import { translate } from 'ra-core';

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: '1em',
        },
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
    },
    title: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        width: '2em',
        height: '2em',
        marginRight: '0.5em',
    },
    panel: {
        marginTop: '1em',
    },
    panelDetails: {
        whiteSpace: 'pre-wrap',
    },
    toolbar: {
        marginTop: '2em',
    },
});

function goBack() {
    history.go(-1);
}

const Error = ({
    error,
    errorInfo,
    classes,
    className,
    translate,
    ...rest
}) => (
    <Fragment>
        <Hidden mdUp>
            <AppBarMobile />
        </Hidden>
        <div className={classnames(classes.container, className)} {...rest}>
            <h1 className={classes.title}>
                <ErrorIcon className={classes.icon} />
                {translate('ra.page.error')}
            </h1>
            <div>{translate('ra.message.error')}</div>
            <ExpansionPanel className={classes.panel}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    {translate('ra.message.details')}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    <div>
                        <h2>{translate(error.toString())}</h2>
                        {errorInfo.componentStack}
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <div className={classes.toolbar}>
                <Button variant="raised" icon={<History />} onClick={goBack}>
                    {translate('ra.action.back')}
                </Button>
            </div>
        </div>
    </Fragment>
);

Error.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    error: PropTypes.object.isRequired,
    errorInfo: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    withStyles(styles),
    translate
);

export default enhance(Error);
