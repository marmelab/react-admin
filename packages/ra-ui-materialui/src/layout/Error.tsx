import * as React from 'react';
import { Fragment, HtmlHTMLAttributes, ErrorInfo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    Button,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Report';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import History from '@material-ui/icons/History';
import { useTranslate } from 'ra-core';

import Title, { TitlePropType } from './Title';
import { ClassesOverride } from '../types';

const useStyles = makeStyles(
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
            maxWidth: '60em',
        },
        panelDetails: {
            whiteSpace: 'pre-wrap',
        },
        toolbar: {
            marginTop: '2em',
        },
        advice: {
            marginTop: '2em',
        },
    }),
    { name: 'RaError' }
);

function goBack() {
    window.history.go(-1);
}

const Error = (props: ErrorProps): JSX.Element => {
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
            {title && <Title defaultTitle={title} />}
            <div className={classnames(classes.container, className)} {...rest}>
                <h1 className={classes.title} role="alert">
                    <ErrorIcon className={classes.icon} />
                    {translate('ra.page.error')}
                </h1>
                <div>{translate('ra.message.error')}</div>
                {process.env.NODE_ENV !== 'production' && (
                    <>
                        <Accordion className={classes.panel}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                {translate(error.toString(), {
                                    _: error.toString(),
                                })}
                            </AccordionSummary>
                            {errorInfo && (
                                <AccordionDetails
                                    className={classes.panelDetails}
                                >
                                    {errorInfo.componentStack}
                                </AccordionDetails>
                            )}
                        </Accordion>

                        <div className={classes.advice}>
                            <Typography align="center">
                                Need help with this error? Try the following:
                            </Typography>
                            <Typography component="div">
                                <ul>
                                    <li>
                                        Check the{' '}
                                        <a href="https://marmelab.com/react-admin/Readme.html">
                                            react-admin documentation
                                        </a>
                                    </li>
                                    <li>
                                        Search on{' '}
                                        <a href="https://stackoverflow.com/questions/tagged/react-admin">
                                            StackOverflow
                                        </a>{' '}
                                        for community answers
                                    </li>
                                    <li>
                                        Get help from the core team via{' '}
                                        <a href="https://marmelab.com/ra-enterprise/#fromsww">
                                            react-admin Enterprise Edition
                                        </a>
                                    </li>
                                </ul>
                            </Typography>
                        </div>
                    </>
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

Error.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    errorInfo: PropTypes.object,
    title: TitlePropType,
};

export interface ErrorProps extends HtmlHTMLAttributes<HTMLDivElement> {
    classes?: ClassesOverride<typeof useStyles>;
    className?: string;
    error: any;
    errorInfo?: ErrorInfo;
    title?: string;
}
export default Error;
