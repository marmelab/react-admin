import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = {
    root: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
    },
};

const CONTAINER_CLASS = 'treenode-content';

class TreeNodeContent extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object.isRequired,
        node: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    handleClick = event => {
        // This ensure clicking on a button does not collapse/expand a node
        // When clicking on the form (empty spaces around buttons) however, it should
        // propagate to the parent
        if (!event.target.matches(`.${CONTAINER_CLASS}`)) {
            event.stopPropagation();
        }
    };

    render() {
        const {
            basePath,
            children,
            classes,
            node: { record },
            resource,
            ...props
        } = this.props;
        return (
            <div
                className={classNames(CONTAINER_CLASS, classes.root)}
                onClick={this.handleClick}
            >
                {Children.map(
                    children,
                    field =>
                        field
                            ? cloneElement(field, {
                                  basePath: field.props.basePath || basePath,
                                  record,
                                  resource,
                                  ...props,
                              })
                            : null
                )}
            </div>
        );
    }
}

export default withStyles(styles)(TreeNodeContent);
