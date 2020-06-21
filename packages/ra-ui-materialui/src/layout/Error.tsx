import { useTranslate } from 'ra-core';
import React, { Fragment, FC } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Report';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import History from '@material-ui/icons/History';
import { ClassNameMap } from '@material-ui/styles';

import Title from './Title';

const useStyles: (props?: any) => ClassNameMap<ErrorClassKey> = makeStyles(
    theme => ({
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
    }),
    { name: 'RaError' }
);

function goBack() {
    window.history.go(-1);
}

const ErrorComponent: FC<ErrorProps> = props => {
    const {
        error,
        errorInfo,
        classes: classesOverride,
        className,
        title,
        ...rest
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <Fragment>
            <Title defaultTitle={title} />
            <div className={classnames(classes.container, className)} {...rest}>
                <h1 className={classes.title} role="alert">
                    <ErrorIcon className={classes.icon} />
                    {translate('ra.page.error')}
                </h1>
                <div>{translate('ra.message.error')}</div>
                {process.env.NODE_ENV !== 'production' && (
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
                )}
                <div className={classes.toolbar}>
                    <Button
                        variant="contained"
                        startIcon={<History />}
                        onClick={goBack}
                    >
                        {translate('ra.action.back')}
                    </Button>
                </div>
            </div>
        </Fragment>
    );
};

export declare type ErrorClassKey =
    | 'container'
    | 'icon'
    | 'toolbar'
    | 'title'
    | 'panel'
    | 'panelDetails';

export interface ErrorProps {
    classes?: Record<ErrorClassKey, string>;
    className?: string;
    error: Error;
    errorInfo?: Record<'componentStack', string>;
    title?: string;
}

ErrorComponent.propTypes = {
    classes: PropTypes.exact({
        container: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        toolbar: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        panel: PropTypes.string.isRequired,
        panelDetails: PropTypes.string.isRequired,
    }),
    className: PropTypes.string,
    error: PropTypes.instanceOf(Error).isRequired,
    errorInfo: PropTypes.exact({
        componentStack: PropTypes.any.isRequired,
    }),
    title: PropTypes.string,
};

export default ErrorComponent;
