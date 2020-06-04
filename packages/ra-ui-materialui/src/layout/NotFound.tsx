import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import HotTub from '@material-ui/icons/HotTub';
import History from '@material-ui/icons/History';
import classnames from 'classnames';

import { useAuthenticated, useTranslate } from 'ra-core';
import Title, { TitleProps } from './Title';
import { RouteComponentProps } from 'react-router-dom';

const useStyles = makeStyles(
    theme => ({
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
    }),
    { name: 'RaNotFound' }
);

function goBack() {
    window.history.go(-1);
}

interface Props extends RouteComponentProps {
    className: string;
    title: TitleProps['defaultTitle'];
    classes?: object;
}

const NotFound: FC<Props> = props => {
    const { className, title, ...rest } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    useAuthenticated();
    return (
        <div
            className={classnames(classes.container, className)}
            {...sanitizeRestProps(rest)}
        >
            <Title defaultTitle={title} />
            <div className={classes.message}>
                <HotTub className={classes.icon} />
                <h1>{translate('ra.page.not_found')}</h1>
                <div>{translate('ra.message.not_found')}.</div>
            </div>
            <div className={classes.toolbar}>
                <Button
                    variant="contained"
                    onClick={goBack}
                    startIcon={<History />}
                >
                    {translate('ra.action.back')}
                </Button>
            </div>
        </div>
    );
};

const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...rest
}: Partial<Props>): Omit<
    Props,
    keyof RouteComponentProps | 'className' | 'title'
> => rest;

NotFound.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    title: PropTypes.string,
};

export default NotFound;
