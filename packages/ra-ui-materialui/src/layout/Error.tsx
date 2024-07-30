import * as React from 'react';
import { ComponentType, ErrorInfo, Fragment, HtmlHTMLAttributes } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { styled } from '@mui/material/styles';
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
import {
    useTranslate,
    useDefaultTitle,
    useResetErrorBoundaryOnLocationChange,
} from 'ra-core';
import type { TitleComponent } from 'ra-core';

import { Title } from './Title';

export const Error = (
    props: InternalErrorProps & {
        errorComponent?: ComponentType<ErrorProps>;
    }
) => {
    const {
        error,
        errorComponent: ErrorComponent,
        errorInfo,
        resetErrorBoundary,
        className,
        ...rest
    } = props;

    const translate = useTranslate();
    const title = useDefaultTitle();
    useResetErrorBoundaryOnLocationChange(resetErrorBoundary);

    if (ErrorComponent) {
        return (
            <ErrorComponent error={error} errorInfo={errorInfo} title={title} />
        );
    }

    return (
        <Fragment>
            {title && <Title title={title} />}
            <Root className={className} {...rest}>
                <h1 className={ErrorClasses.title} role="alert">
                    <ErrorIcon className={ErrorClasses.icon} />
                    {translate('ra.page.error')}
                </h1>
                <div>{translate('ra.message.error')}</div>
                {process.env.NODE_ENV !== 'production' && (
                    <>
                        <Accordion className={ErrorClasses.panel}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className={ErrorClasses.panelSumary}
                            >
                                {translate(error.message, {
                                    _: error.message,
                                })}
                            </AccordionSummary>
                            <AccordionDetails
                                className={ErrorClasses.panelDetails}
                            >
                                {/*
                                    error message is repeated here to allow users to copy it. AccordionSummary doesn't support text selection.
                                */}
                                <p>
                                    {translate(error.message, {
                                        _: error.message,
                                    })}
                                </p>
                                <p>{errorInfo?.componentStack}</p>
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
                                        <a href="https://marmelab.com/react-admin/documentation.html">
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
                                        <a href="https://react-admin-ee.marmelab.com/#fromsww">
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

interface InternalErrorProps
    extends Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'>,
        FallbackProps {
    className?: string;
    errorInfo?: ErrorInfo;
}

export interface ErrorProps extends Pick<FallbackProps, 'error'> {
    errorInfo?: ErrorInfo;
    title?: TitleComponent;
}

const PREFIX = 'RaError';

export const ErrorClasses = {
    container: `${PREFIX}-container`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
    panel: `${PREFIX}-panel`,
    panelSumary: `${PREFIX}-panelSumary`,
    panelDetails: `${PREFIX}-panelDetails`,
    toolbar: `${PREFIX}-toolbar`,
    advice: `${PREFIX}-advice`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        padding: '1em',
    },
    fontFamily: 'Roboto, sans-serif',
    opacity: 0.5,

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

    [`& .${ErrorClasses.panelSumary}`]: {
        userSelect: 'all',
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
