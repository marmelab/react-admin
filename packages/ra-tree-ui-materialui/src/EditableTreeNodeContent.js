import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { crudUpdate as crudUpdateAction } from 'ra-core';

const styles = {
    root: {
        display: 'flex',
        flexGrow: 1,
    },
};

class TreeNodeContent extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object.isRequired,
        crudUpdate: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        record: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
        submitOnEnter: PropTypes.bool,
    };

    handleClick = event => {
        // This ensure clicking on an input or button does not collapse/expand a node
        // When clicking on the form (empty spaces around inputs) however, it should
        // propagate to the parent
        if (event.target.tagName.toLowerCase() !== 'form') {
            event.stopPropagation();
        }
    };

    handleSubmit = () => {
        const {
            basePath,
            crudUpdate,
            handleSubmit,
            node: { record },
            resource,
        } = this.props;

        return handleSubmit(values =>
            crudUpdate(
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
            basePath,
            classes,
            children,
            node: { record },
            resource,
            submitOnEnter,
        } = this.props;
        return (
            <form className={classes.root} onClick={this.handleClick}>
                {Children.map(
                    children,
                    field =>
                        field
                            ? cloneElement(field, {
                                  basePath: field.props.basePath || basePath,
                                  handleSubmit: this.handleSubmit,
                                  record,
                                  resource,
                                  submitOnEnter,
                              })
                            : null
                )}
            </form>
        );
    }
}

const mapStateToProps = (state, { node }) => {
    return {
        form: `tree-node-form-${node.id}`,
        initialValues: node.record,
        record: node.record,
    };
};

export default compose(
    connect(
        mapStateToProps,
        { crudUpdate: crudUpdateAction }
    ),
    reduxForm({
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
    }),
    withStyles(styles)
)(TreeNodeContent);
