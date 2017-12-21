import React, { Children } from 'react';
import PropTypes from 'prop-types';
import MuiToolbar from 'material-ui/Toolbar';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

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
    classes,
    className,
    invalid,
    submitOnEnter,
    handleSubmitWithRedirect,
    children,
    ...rest
}) => (
    <Responsive
        small={
            <MuiToolbar
                className={classnames(classes.mobileToolbar, className)}
                disableGutters
                {...rest}
            >
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
            </MuiToolbar>
        }
        medium={
            <MuiToolbar className={className} {...rest}>
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
            </MuiToolbar>
        }
    />
);

Toolbar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

export default withStyles(styles)(Toolbar);
