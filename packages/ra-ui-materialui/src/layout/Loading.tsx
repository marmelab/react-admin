import * as React from 'react';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/material';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslate } from 'ra-core';

export const Loading = (props: LoadingProps) => {
    const {
        className,
        loadingPrimary = 'ra.page.loading',
        loadingSecondary = 'ra.message.loading',
        ...rest
    } = props;

    const translate = useTranslate();
    return (
        <Root className={className} {...rest}>
            <div className={LoadingClasses.message}>
                <CircularProgress
                    className={LoadingClasses.icon}
                    color="primary"
                />
                <h1>{translate(loadingPrimary, { _: loadingPrimary })}</h1>
                <div>
                    {translate(loadingSecondary, { _: loadingSecondary })}
                </div>
            </div>
        </Root>
    );
};

Loading.propTypes = {
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};

export interface LoadingProps {
    className?: string;
    loadingPrimary?: string;
    loadingSecondary?: string;
    sx?: SxProps;
}

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
