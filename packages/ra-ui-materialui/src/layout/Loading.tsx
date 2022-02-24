import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslate } from 'ra-core';

export const Loading = props => {
    const {
        className,
        loadingPrimary = 'ra.page.loading',
        loadingSecondary = 'ra.message.loading',
    } = props;

    const translate = useTranslate();
    return (
        <Root className={className}>
            <div className={LoadingClasses.message}>
                <CircularProgress
                    className={LoadingClasses.icon}
                    color="primary"
                />
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

const PREFIX = 'RaLoading';

export const LoadingClasses = {
    root: `${PREFIX}-root`,
    icon: `${PREFIX}-icon`,
    message: `${PREFIX}-message`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
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

    [`& .${LoadingClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${LoadingClasses.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
        margin: '0 1em',
    },
}));
