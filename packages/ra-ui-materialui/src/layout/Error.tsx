import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment, HtmlHTMLAttributes, ErrorInfo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    Button,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Report';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import History from '@mui/icons-material/History';
import { useTranslate } from 'ra-core';

import Title, { TitlePropType } from './Title';

const PREFIX = 'RaError';

const classes = {
    container: `${PREFIX}-container`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
    panel: `${PREFIX}-panel`,
    panelDetails: `${PREFIX}-panelDetails`,
    toolbar: `${PREFIX}-toolbar`,
    advice: `${PREFIX}-advice`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.container}`]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            padding: '1em',
        },
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
    },

    [`& .${classes.title}`]: {
        display: 'flex',
        alignItems: 'center',
    },

    [`& .${classes.icon}`]: {
        width: '2em',
        height: '2em',
        marginRight: '0.5em',
    },

    [`& .${classes.panel}`]: {
        marginTop: '1em',
        maxWidth: '60em',
    },

    [`& .${classes.panelDetails}`]: {
        whiteSpace: 'pre-wrap',
    },

    [`& .${classes.toolbar}`]: {
        marginTop: '2em',
    },

    [`& .${classes.advice}`]: {
        marginTop: '2em',
    },
}));

function goBack() {
    window.history.go(-1);
}

const Error = (props: ErrorProps): JSX.Element => {
    const { error, errorInfo, className, title, ...rest } = props;

    const translate = useTranslate();

    return (
        <Fragment>
            {title && <Title defaultTitle={title} />}
            <Root
                className={classnames(classes.container, className)}
                {...rest}
            >
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
            </Root>
        </Fragment>
    );
};

Error.propTypes = {
    className: PropTypes.string,
    error: PropTypes.object.isRequired,
    errorInfo: PropTypes.object,
    title: TitlePropType,
};

export interface ErrorProps extends HtmlHTMLAttributes<HTMLDivElement> {
    className?: string;
    error: Error;
    errorInfo?: ErrorInfo;
    title?: string;
}
export default Error;
