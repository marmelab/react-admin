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
        if (!event.target.matches(`.${CONTAINER_CLASS}`)) {
            event.stopPropagation();
        }
    };

    render() {
        const {
            basePath,
            children,
            classes,
            node: { __children, ...node },
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
                                  record: node,
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
