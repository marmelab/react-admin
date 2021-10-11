import React, { Component, ErrorInfo, HtmlHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { CoreLayoutProps } from 'react-admin';

import { Notification, Error } from 'react-admin';
import Header from './Header';

class Layout extends Component<LayoutProps, LayoutState> {
    state: LayoutState = {
        hasError: false,
        errorMessage: undefined,
        errorInfo: undefined,
    };

    constructor(props: any) {
        super(props);
        /**
         * Reset the error state upon navigation
         *
         * @see https://stackoverflow.com/questions/48121750/browser-navigation-broken-by-use-of-react-error-boundaries
         */
        props.history.listen(() => {
            if (this.state.hasError) {
                this.setState({ hasError: false });
            }
        });
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            hasError: true,
            errorMessage: error,
            errorInfo,
        });
    }

    render() {
        const { theme, title, children } = this.props;
        const { hasError, errorMessage, errorInfo } = this.state;
        return (
            <ThemeProvider theme={createTheme(theme)}>
                <CssBaseline />
                <Header />
                <Container>
                    <main id="main-content">
                        {hasError ? (
                            <Error
                                error={errorMessage as Error}
                                errorInfo={errorInfo}
                                title={title as string}
                            />
                        ) : (
                            children
                        )}
                    </main>
                </Container>
                <Notification />
            </ThemeProvider>
        );
    }

    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        title: PropTypes.node.isRequired,
    };
}

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'>,
        RouteComponentProps {}

export interface LayoutState {
    hasError: boolean;
    errorMessage?: Error;
    errorInfo?: ErrorInfo;
}

// @ts-ignore
export default withRouter(Layout);
