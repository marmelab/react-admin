import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import { type MUIStyledCommonProps } from '@mui/system';
import Button from '@mui/material/Button';
import HotTub from '@mui/icons-material/HotTub';
import History from '@mui/icons-material/History';
import { useAuthenticated, useDefaultTitle, useTranslate } from 'ra-core';

import { Title } from './Title';
import { Loading } from './Loading';

export const NotFound = (inProps: NotFoundProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const translate = useTranslate();
    const { isPending } = useAuthenticated();
    const title = useDefaultTitle();

    if (isPending) return <Loading />;
    return (
        <Root {...sanitizeRestProps(props)}>
            <Title defaultTitle={title} />
            <div className={NotFoundClasses.message}>
                <HotTub className={NotFoundClasses.icon} />
                <h1>{translate('ra.page.not_found')}</h1>
                <div>{translate('ra.message.not_found')}.</div>
            </div>
            <div className={NotFoundClasses.toolbar}>
                <Button
                    variant="contained"
                    startIcon={<History />}
                    onClick={goBack}
                >
                    {translate('ra.action.back')}
                </Button>
            </div>
        </Root>
    );
};

export interface NotFoundProps
    extends React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >,
        MUIStyledCommonProps<Theme> {}

const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...rest
}: any): NotFoundProps => rest;

const PREFIX = 'RaNotFound';

export const NotFoundClasses = {
    icon: `${PREFIX}-icon`,
    message: `${PREFIX}-message`,
    toolbar: `${PREFIX}-toolbar`,
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
    [theme.breakpoints.down('md')]: {
        height: '100vh',
        marginTop: '-3em',
    },

    [`& .${NotFoundClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${NotFoundClasses.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
        margin: '0 1em',
    },

    [`& .${NotFoundClasses.toolbar}`]: {
        textAlign: 'center',
        marginTop: '2em',
    },
}));

function goBack() {
    window.history.go(-1);
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaNotFound: 'root';
    }

    interface ComponentsPropsList {
        RaNotFound: Partial<NotFoundProps>;
    }

    interface Components {
        RaNotFound?: {
            defaultProps?: ComponentsPropsList['RaNotFound'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaNotFound'];
        };
    }
}
