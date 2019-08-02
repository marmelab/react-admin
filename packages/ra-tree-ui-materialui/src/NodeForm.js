import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { makeStyles } from '@material-ui/core/styles';
import { reduxForm } from 'redux-form';
import {
    crudUpdate as crudUpdateAction,
    startUndoable as startUndoableAction,
} from 'ra-core';

import NodeFormActions from './NodeFormActions';

const useStyles = makeStyles({
    root: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
    },
});

const sanitizeRestProps = ({
    anyTouched,
    array,
    asyncBlurFields,
    asyncValidate,
    asyncValidating,
    autofill,
    blur,
    cancelDropOnChildren,
    change,
    clearAsyncError,
    clearFields,
    clearSubmit,
    clearSubmitErrors,
    crudUpdate,
    destroy,
    dirty,
    dispatch,
    dispatchCrudUpdate,
    form,
    getTreeState,
    handleSubmit,
    initialize,
    initialized,
    initialValues,
    invalid,
    isDragging,
    onSelect,
    onToggleItem,
    onUnselectItems,
    parentSource,
    pristine,
    pure,
    redirect,
    reset,
    resetSection,
    save,
    startUndoable,
    submit,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    translate,
    triggerSubmit,
    undoable,
    undoableDragDrop,
    untouch,
    valid,
    validate,
    ...props
}) => props;

const NodeForm = ({
    actions,
    basePath,
    children,
    invalid,
    node,
    pristine,
    resource,
    saving,
    submitOnEnter = true,
    dispatchCrudUpdate,
    node: { record },
    startUndoable,
    undoable = true,
    ...props
}) => {
    const classes = useStyles();

    const handleClick = event => {
        event.persist();
        // This ensure clicking on an input or button does not collapse/expand a node
        // When clicking on the form (empty spaces around inputs) however, it should
        // propagate to the parent
        if (event.target.tagName.toLowerCase() !== 'form') {
            event.stopPropagation();
        }
    };

    const handleDrop = event => {
        event.persist();
        if (this.props.cancelDropOnChildren) {
            event.preventDefault();
        }
    };

    const handleSubmit = () => {
        return props.handleSubmit(values =>
            undoable
                ? startUndoable(
                      crudUpdateAction(
                          resource,
                          record.id,
                          { ...record, ...values },
                          record,
                          basePath,
                          false
                      )
                  )
                : dispatchCrudUpdate(
                      resource,
                      record.id,
                      { ...record, ...values },
                      record,
                      basePath,
                      false
                  )
        );
    };

    return (
        <form
            className={classes.root}
            onClick={handleClick}
            {...sanitizeRestProps(props)}
        >
            {Children.map(children, field =>
                field
                    ? cloneElement(field, {
                          basePath: field.props.basePath || basePath,
                          onDrop: handleDrop,
                          record: node.record,
                          resource,
                      })
                    : null
            )}
            {actions &&
                cloneElement(actions, {
                    basePath,
                    record: node.record,
                    resource,
                    handleSubmit: handleSubmit,
                    handleSubmitWithRedirect: handleSubmit,
                    invalid,
                    pristine,
                    saving,
                    submitOnEnter,
                })}
        </form>
    );
};

NodeForm.propTypes = {
    actions: PropTypes.node,
    basePath: PropTypes.string.isRequired,
    cancelDropOnChildren: PropTypes.bool,
    children: PropTypes.node,
    dispatchCrudUpdate: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    node: PropTypes.object.isRequired,
    pristine: PropTypes.bool,
    resource: PropTypes.string.isRequired,
    saving: PropTypes.bool,
    startUndoable: PropTypes.func.isRequired,
    submitOnEnter: PropTypes.bool,
    undoable: PropTypes.bool,
};

NodeForm.defaultProps = {
    actions: <NodeFormActions />,
};

const mapStateToProps = (state, { node }) => ({
    form: `tree-node-form-${node.id}`,
    initialValues: node.record,
    record: node.record,
});

export default compose(
    connect(
        mapStateToProps,
        {
            dispatchCrudUpdate: crudUpdateAction,
            startUndoable: startUndoableAction,
        }
    ),
    reduxForm({
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
    })
)(NodeForm);
