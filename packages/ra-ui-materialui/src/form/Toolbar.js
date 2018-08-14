import React, { Children } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MuiToolbar from '@material-ui/core/Toolbar';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { SaveButton, DeleteButton } from '../button';

const styles = {
    desktopToolbar: {
        justifyContent: 'space-between',
    },
    mobileToolbar: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        zIndex: 2,
    },
};

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;

const Toolbar = ({
    basePath,
    children,
    classes,
    className,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    width,
    ...rest
}) => (
    <MuiToolbar
        className={classnames(
            width === 'xs' ? classes.mobileToolbar : classes.desktopToolbar,
            className
        )}
        disableGutters
        {...rest}
    >
        <span>
            {Children.count(children) === 0 ? (
                <SaveButton
                    handleSubmitWithRedirect={handleSubmitWithRedirect}
                    invalid={invalid}
                    redirect={redirect}
                    saving={saving}
                    submitOnEnter={submitOnEnter}
                />
            ) : (
                Children.map(
                    children,
                    button =>
                        button
                            ? React.cloneElement(button, {
                                  basePath,
                                  handleSubmit,
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
        </span>
        {record &&
            record.id && (
                <DeleteButton
                    basePath={basePath}
                    record={record}
                    resource={resource}
                />
            )}
    </MuiToolbar>
);

Toolbar.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    handleSubmit: PropTypes.func,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitOnEnter: PropTypes.bool,
    width: PropTypes.string,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

const enhance = compose(
    withWidth(),
    withStyles(styles)
);
export default enhance(Toolbar);
