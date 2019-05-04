import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles, createStyles } from '@material-ui/core/styles';
import HotTub from '@material-ui/icons/HotTub';
import History from '@material-ui/icons/History';
import classnames from 'classnames';

import { useTranslate } from 'ra-core';
import Title from './Title';

const styles = theme =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: {
                height: '100%',
            },
            [theme.breakpoints.down('sm')]: {
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

const NotFound = ({ classes, className, title, ...rest }) => {
    const translate = useTranslate();
    return (
        <div className={classnames(classes.container, className)} {...rest}>
            <Title defaultTitle={title} />
            <div className={classes.message}>
                <HotTub className={classes.icon} />
                <h1>{translate('ra.page.not_found')}</h1>
                <div>{translate('ra.message.not_found')}.</div>
            </div>
            <div className={classes.toolbar}>
                <Button variant="raised" icon={<History />} onClick={goBack}>
                    {translate('ra.action.back')}
                </Button>
            </div>
        </div>
    );
};

NotFound.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
};

export default withStyles(styles)(NotFound);
