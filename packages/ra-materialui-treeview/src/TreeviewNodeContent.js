import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        display: 'flex',
        flexGrow: 1,
    },
};

class TreeviewNodeContent extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    handleClick = event => {
        event.stopPropagation();
    };

    handleSubmit = () => {
        const {
            handleSubmit,
            node: { __children, __depth, ...node },
            onSubmit,
        } = this.props;

        return handleSubmit(values => onSubmit({ ...node, ...values }));
    };

    render() {
        const {
            basePath,
            classes,
            children,
            node: { __children, ...node },
            resource,
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
                                  record: node,
                                  resource,
                                  submitOnEnter: true,
                              })
                            : null
                )}
            </form>
        );
    }
}

export default reduxForm({
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})(withStyles(styles)(TreeviewNodeContent));
