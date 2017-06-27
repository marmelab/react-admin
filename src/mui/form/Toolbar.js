import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { Toolbar as MuiToolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { SaveButton } from '../button';
import Responsive from '../layout/Responsive';

const styles = {
    mobileToolbar: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        zIndex: 2,
    },
};

const valueOrDefault = (value, defaultValue) => typeof value === 'undefined' ? defaultValue : value;

const Toolbar = ({ invalid, submitOnEnter, handleSubmitWithRedirect, redirect, children }) => (
    <Responsive
        small={
            <MuiToolbar style={styles.mobileToolbar} noGutter>
                <ToolbarGroup>
                    {Children.count(children) === 0
                        ? <SaveButton
                            invalid={invalid}
                            submitOnEnter={submitOnEnter}
                            handleSubmitWithRedirect={handleSubmitWithRedirect}
                            redirect={redirect}
                            raised={false}
                        />
                        : Children.map(children, button => React.cloneElement(button, {
                            invalid,
                            handleSubmitWithRedirect,
                            raised: false,
                            redirect: valueOrDefault(button.props.redirect, redirect),
                            submitOnEnter: valueOrDefault(button.props.submitOnEnter, submitOnEnter),
                        }))
                    }
                </ToolbarGroup>
            </MuiToolbar>
        }
        medium={
            <MuiToolbar>
                <ToolbarGroup>
                    {Children.count(children) === 0
                        ? <SaveButton
                            invalid={invalid}
                            submitOnEnter={submitOnEnter}
                            handleSubmitWithRedirect={handleSubmitWithRedirect}
                            redirect={redirect}
                        />
                        : Children.map(children, button => React.cloneElement(button, {
                            invalid,
                            handleSubmitWithRedirect,
                            redirect: valueOrDefault(button.props.redirect, redirect),
                            submitOnEnter: valueOrDefault(button.props.submitOnEnter, submitOnEnter),
                        }))
                    }
                </ToolbarGroup>
            </MuiToolbar>
        }
    />
);

Toolbar.propTypes = {
    children: PropTypes.node,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    submitOnEnter: PropTypes.bool,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

export default Toolbar;
