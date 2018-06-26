import React, { Children } from 'react';
import PropTypes from 'prop-types';
import MuiToolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
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
    children,
    classes,
    className,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    redirect,
    saving,
    submitOnEnter,
    ...rest
}) => (
    <Responsive
        xsmall={
            <MuiToolbar
                className={classnames(classes.mobileToolbar, className)}
                disableGutters
                {...rest}
            >
                {Children.count(children) === 0 ? (
                    <SaveButton
                        handleSubmitWithRedirect={handleSubmitWithRedirect}
                        invalid={invalid}
                        variant="flat"
                        redirect={redirect}
                        submitOnEnter={submitOnEnter}
                        saving={saving}
                    />
                ) : (
                    Children.map(
                        children,
                        button =>
                            button
                                ? React.cloneElement(button, {
                                      handleSubmitWithRedirect,
                                      invalid,
                                      pristine,
                                      saving,
                                      submitOnEnter: valueOrDefault(
                                          button.props.submitOnEnter,
                                          submitOnEnter
                                      ),
                                      variant: 'flat',
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
                        redirect={redirect}
                        submitOnEnter={submitOnEnter}
                        saving={saving}
                    />
                ) : (
                    Children.map(
                        children,
                        button =>
                            button
                                ? React.cloneElement(button, {
                                      handleSubmitWithRedirect,
                                      invalid,
                                      pristine,
                                      saving,
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
    pristine: PropTypes.bool,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitOnEnter: PropTypes.bool,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

export default withStyles(styles)(Toolbar);
