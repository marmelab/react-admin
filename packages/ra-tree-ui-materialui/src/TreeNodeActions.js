import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: theme.spacing.unit * 4,
    },
});

export class TreeNodeActionsView extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        record: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    render() {
        const { children, classes, ...props } = this.props;
        return (
            <span className={classes.root}>
                {Children.map(
                    children,
                    action => (action ? cloneElement(action, props) : null)
                )}
            </span>
        );
    }
}

export default withStyles(styles)(TreeNodeActionsView);
