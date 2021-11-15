import * as React from 'react';
import { Fragment, HtmlHTMLAttributes, useEffect, useRef } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { styled } from '@mui/material/styles';
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
import { useLocation } from 'react-router';

import { Title, TitlePropType } from './Title';

export const Error = (props: ErrorProps) => {
    const { error, resetErrorBoundary, className, title, ...rest } = props;
    const { pathname } = useLocation();
    const originalPathname = useRef(pathname);

    useEffect(() => {
        if (pathname !== originalPathname.current) {
            resetErrorBoundary();
        }
    }, [pathname, resetErrorBoundary]);

    const translate = useTranslate();

    return (
        <Fragment>
            {title && <Title defaultTitle={title} />}
            <Root
                className={classnames(ErrorClasses.container, className)}
                {...rest}
            >
                <h1 className={ErrorClasses.title} role="alert">
                    <ErrorIcon className={ErrorClasses.icon} />
                    {translate('ra.page.error')}
                </h1>
                <div>{translate('ra.message.error')}</div>
                {process.env.NODE_ENV !== 'production' && (
                    <>
                        <Accordion className={ErrorClasses.panel}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                {translate(error.message, {
                                    _: error.message,
                                })}
                            </AccordionSummary>
                            <AccordionDetails
                                className={ErrorClasses.panelDetails}
                            >
                                {error.stack}
                            </AccordionDetails>
                        </Accordion>

                        <div className={ErrorClasses.advice}>
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
                <div className={ErrorClasses.toolbar}>
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

export interface ErrorProps
    extends HtmlHTMLAttributes<HTMLDivElement>,
        FallbackProps {
    className?: string;
    title?: string;
}

const PREFIX = 'RaError';

export const ErrorClasses = {
    container: `${PREFIX}-container`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
    panel: `${PREFIX}-panel`,
    panelDetails: `${PREFIX}-panelDetails`,
    toolbar: `${PREFIX}-toolbar`,
    advice: `${PREFIX}-advice`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${ErrorClasses.container}`]: {
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

    [`& .${ErrorClasses.title}`]: {
        display: 'flex',
        alignItems: 'center',
    },

    [`& .${ErrorClasses.icon}`]: {
        width: '2em',
        height: '2em',
        marginRight: '0.5em',
    },

    [`& .${ErrorClasses.panel}`]: {
        marginTop: '1em',
        maxWidth: '60em',
    },

    [`& .${ErrorClasses.panelDetails}`]: {
        whiteSpace: 'pre-wrap',
    },

    [`& .${ErrorClasses.toolbar}`]: {
        marginTop: '2em',
    },

    [`& .${ErrorClasses.advice}`]: {
        marginTop: '2em',
    },
}));

function goBack() {
    window.history.go(-1);
}
