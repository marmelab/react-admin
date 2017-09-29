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

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;

const Toolbar = ({
    invalid,
    submitOnEnter,
    handleSubmitWithRedirect,
    children,
}) => (
    <Responsive
        small={
            <MuiToolbar style={styles.mobileToolbar} noGutter>
                <ToolbarGroup>
                    {Children.count(children) === 0 ? (
                        <SaveButton
                            handleSubmitWithRedirect={handleSubmitWithRedirect}
                            invalid={invalid}
                            raised={false}
                            submitOnEnter={submitOnEnter}
                        />
                    ) : (
                        Children.map(
                            children,
                            button =>
                                button
                                    ? React.cloneElement(button, {
                                          invalid,
                                          handleSubmitWithRedirect,
                                          raised: false,
                                          submitOnEnter: valueOrDefault(
                                              button.props.submitOnEnter,
                                              submitOnEnter
                                          ),
                                      })
                                    : null
                        )
                    )}
                </ToolbarGroup>
            </MuiToolbar>
        }
        medium={
            <MuiToolbar>
                <ToolbarGroup>
                    {Children.count(children) === 0 ? (
                        <SaveButton
                            handleSubmitWithRedirect={handleSubmitWithRedirect}
                            invalid={invalid}
                            submitOnEnter={submitOnEnter}
                        />
                    ) : (
                        Children.map(
                            children,
                            button =>
                                button
                                    ? React.cloneElement(button, {
                                          handleSubmitWithRedirect,
                                          invalid,
                                          submitOnEnter: valueOrDefault(
                                              button.props.submitOnEnter,
                                              submitOnEnter
                                          ),
                                      })
                                    : null
                        )
                    )}
                </ToolbarGroup>
            </MuiToolbar>
        }
    />
);

Toolbar.propTypes = {
    children: PropTypes.node,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

export default Toolbar;
