import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslate } from 'ra-core';

const PREFIX = 'RaLoading';

const classes = {
    container: `${PREFIX}-container`,
    icon: `${PREFIX}-icon`,
    message: `${PREFIX}-message`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.container}`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        [theme.breakpoints.up('md')]: {
            height: '100%',
        },
        [theme.breakpoints.down('xl')]: {
            height: '100vh',
            marginTop: '-3em',
        },
    },

    [`& .${classes.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${classes.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
        margin: '0 1em',
    },
}));

const Loading = props => {
    const {
        className,
        loadingPrimary = 'ra.page.loading',
        loadingSecondary = 'ra.message.loading',
    } = props;

    const translate = useTranslate();
    return (
        <Root className={classnames(classes.container, className)}>
            <div className={classes.message}>
                <CircularProgress className={classes.icon} color="primary" />
                <h1>{translate(loadingPrimary)}</h1>
                <div>{translate(loadingSecondary)}.</div>
            </div>
        </Root>
    );
};

Loading.propTypes = {
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};

Loading.defaultProps = {
    loadingPrimary: 'ra.page.loading',
    loadingSecondary: 'ra.message.loading',
};

export default Loading;
