import React, { Children, Fragment, isValidElement } from 'react';
import PropTypes from 'prop-types';
import MuiToolbar from '@material-ui/core/Toolbar';
import withWidth from '@material-ui/core/withWidth';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { SaveButton, DeleteButton } from '../button';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            backgroundColor:
                theme.palette.type === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
        },
        desktopToolbar: {
            marginTop: theme.spacing(2),
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
            zIndex: 2,
        },
        defaultToolbar: {
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
        },
        spacer: {
            [theme.breakpoints.down('xs')]: {
                height: '5em',
            },
        },
    }),
    { name: 'RaToolbar' }
);

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;

const Toolbar = ({
    basePath,
    children,
    className,
    classes: classesOverride,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    undoable,
    width,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    return (
        <Fragment>
            <MuiToolbar
                className={classnames(
                    classes.toolbar,
                    {
                        [classes.mobileToolbar]: width === 'xs',
                        [classes.desktopToolbar]: width !== 'xs',
                    },
                    className
                )}
                role="toolbar"
                {...rest}
            >
                {Children.count(children) === 0 ? (
                    <div className={classes.defaultToolbar}>
                        <SaveButton
                            handleSubmitWithRedirect={
                                handleSubmitWithRedirect || handleSubmit
                            }
                            invalid={invalid}
                            redirect={redirect}
                            saving={saving}
                            submitOnEnter={submitOnEnter}
                        />
                        {record && typeof record.id !== 'undefined' && (
                            <DeleteButton
                                basePath={basePath}
                                record={record}
                                resource={resource}
                                undoable={undoable}
                            />
                        )}
                    </div>
                ) : (
                    Children.map(children, button =>
                        button && isValidElement(button)
                            ? React.cloneElement(button, {
                                  basePath,
                                  handleSubmit: valueOrDefault(
                                      button.props.handleSubmit,
                                      handleSubmit
                                  ),
                                  handleSubmitWithRedirect: valueOrDefault(
                                      button.props.handleSubmitWithRedirect,
                                      handleSubmitWithRedirect
                                  ),
                                  invalid,
                                  pristine,
                                  record,
                                  resource,
                                  saving,
                                  submitOnEnter: valueOrDefault(
                                      button.props.submitOnEnter,
                                      submitOnEnter
                                  ),
                                  undoable: valueOrDefault(
                                      button.props.undoable,
                                      undoable
                                  ),
                              })
                            : null
                    )
                )}
            </MuiToolbar>
            <div className={classes.spacer} />
        </Fragment>
    );
};

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
    undoable: PropTypes.bool,
    width: PropTypes.string,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

export default withWidth({ initialWidth: 'xs' })(Toolbar);
