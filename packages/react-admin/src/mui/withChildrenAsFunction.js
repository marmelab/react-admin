import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';
import { AUTH_GET_PERMISSIONS } from '../auth/types';

export default BaseComponent => {
    class WithChildrenAsFunction extends Component {
        state = { children: null };

        static propTypes = {
            authClient: PropTypes.func,
            children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
                .isRequired,
        };

        componentDidMount() {
            return this.initializeChildren(this.props.children);
        }

        async initializeChildren(children) {
            if (typeof children === 'function') {
                let permissions;

                if (this.props.authClient) {
                    permissions = await this.props.authClient(
                        AUTH_GET_PERMISSIONS
                    );
                }

                const childrenResult = children(permissions);
                let finalChildren = childrenResult;

                if (typeof childrenResult.then === 'function') {
                    finalChildren = await childrenResult;
                }

                this.setState({ children: finalChildren });
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
    })(WithChildrenAsFunction);
};
