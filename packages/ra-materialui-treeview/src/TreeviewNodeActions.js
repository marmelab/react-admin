import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        marginLeft: 'auto',
        marginRight: theme.spacing.unit * 4,
    },
});

export class TreeviewNodeActionsView extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        handleSubmit: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    render() {
        const {
            basePath,
            children,
            classes,
            handleSubmit,
            record,
            resource,
        } = this.props;
        return (
            <span className={classes.root}>
                {Children.map(
                    children,
                    field =>
                        field
                            ? cloneElement(field, {
                                  basePath: field.props.basePath || basePath,
                                  handleSubmitWithRedirect: handleSubmit,
                                  handleSubmit,
                                  record,
                                  resource,
                              })
                            : null
                )}
            </span>
        );
    }
}

export default withStyles(styles)(TreeviewNodeActionsView);
