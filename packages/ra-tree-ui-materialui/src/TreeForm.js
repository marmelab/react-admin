import React, { cloneElement, Children, Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm } from 'redux-form';
import {
    crudUpdate as crudUpdateAction,
    startUndoable as startUndoableAction,
} from 'ra-core';

import TreeFormActions from './TreeFormActions';

const styles = {
    root: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
    },
};

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
class Form extends Component {
    static defaultProps = {
        actions: <TreeFormActions />,
    };

    handleClick = event => {
        event.persist();
        // This ensure clicking on an input or button does not collapse/expand a node
        // When clicking on the form (empty spaces around inputs) however, it should
        // propagate to the parent
        if (event.target.tagName.toLowerCase() !== 'form') {
            event.stopPropagation();
        }
    };

    handleDrop = event => {
        event.persist();
        if (this.props.cancelDropOnChildren) {
            event.preventDefault();
        }
    };

    handleSubmit = () => {
        const {
            basePath,
            dispatchCrudUpdate,
            handleSubmit,
            node: { record },
            resource,
            startUndoable,
            undoable = true,
        } = this.props;

        return handleSubmit(
            values =>
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

    render() {
        const {
            actions,
            basePath,
            children,
            classes,
            handleSubmit,
            node,
            resource,
            submitOnEnter = true,
            ...props
        } = this.props;

        return (
            <form className={classes.root} onClick={this.handleClick}>
                {Children.map(
                    children,
                    field =>
                        field
                            ? cloneElement(field, {
                                  basePath: field.props.basePath || basePath,
                                  onDrop: this.handleDrop,
                                  record: node.record,
                                  resource,
                                  ...sanitizeRestProps(props),
                              })
                            : null
                )}
                {actions &&
                    cloneElement(actions, {
                        basePath,
                        record: node.record,
                        resource,
                        handleSubmit: this.handleSubmit,
                        handleSubmitWithRedirect: this.handleSubmit,
                        submitOnEnter,
                        ...sanitizeRestProps(props),
                    })}
            </form>
        );
    }
}

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
    }),
    withStyles(styles)
)(Form);
