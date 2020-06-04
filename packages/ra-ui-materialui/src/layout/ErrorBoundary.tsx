import { Component, ComponentType, createElement, ErrorInfo } from 'react';
import PropTypes from 'prop-types';
import { ComponentPropType, TitleComponent } from 'ra-core';
import { withRouter, RouteComponentProps } from 'react-router';

import { ErrorProps } from './Error';

class _ErrorBoundary extends Component<
    ErrorBoundaryProps & RouteComponentProps,
    ErrorBoundaryState
> {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        error: ComponentPropType,
        title: PropTypes.element.isRequired,
    };

    state = { hasError: false, errorMessage: null, errorInfo: null };

    constructor(props) {
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

    componentDidCatch(errorMessage, errorInfo) {
        this.setState({ hasError: true, errorMessage, errorInfo });
    }

    render() {
        const { hasError, errorMessage, errorInfo } = this.state;
        const { children, error, title } = this.props;

        return hasError
            ? createElement(error, {
                  error: errorMessage,
                  errorInfo,
                  title,
              })
            : children;
    }
}

export const ErrorBoundary = withRouter(_ErrorBoundary);

export interface ErrorBoundaryProps {
    error: ComponentType<ErrorProps>;
    title?: TitleComponent;
}

interface ErrorBoundaryState {
    hasError?: boolean;
    errorMessage: Error | null;
    errorInfo: ErrorInfo | null;
}
