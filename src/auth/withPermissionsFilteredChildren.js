import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';
import { AUTH_GET_PERMISSIONS } from './types';
import getMissingAuthClientError from '../util/getMissingAuthClientError';

export default BaseComponent => {
    class WithPermissionsFilteredChildren extends Component {
        state = { children: null };

        static propTypes = {
            authClient: PropTypes.func,
            children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
                .isRequired,
        };

        componentDidMount() {
            this.initializeChildren(this.props.children);
        }

        initializeChildren(children) {
            if (typeof children === 'function') {
                if (!this.props.authClient) {
                    throw new Error(
                        getMissingAuthClientError(BaseComponent.name)
                    );
                }

                this.props
                    .authClient(AUTH_GET_PERMISSIONS)
                    .then(permissions => {
                        const allowedChildren = children(permissions);
                        this.setState({ children: allowedChildren });
                    });
            } else {
                this.setState({ children });
            }
        }

        render() {
            const { children } = this.state;
            const { authClient, ...props } = this.props;
            return (
                <BaseComponent {...props}>
                    {children && Array.isArray(children) ? (
                        children.map(
                            child =>
                                child
                                    ? cloneElement(child, {
                                          key:
                                              child.props.name ||
                                              child.props.source ||
                                              child.props.label,
                                      })
                                    : null
                        )
                    ) : (
                        children
                    )}
                </BaseComponent>
            );
        }
    }

    return getContext({
        authClient: PropTypes.func,
    })(WithPermissionsFilteredChildren);
};
