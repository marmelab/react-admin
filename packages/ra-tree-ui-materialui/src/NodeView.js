import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const CONTAINER_CLASS = 'treenode-content';

const styles = {
    root: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
    },
};

const sanitizeRestProps = ({
    cancelDropOnChildren,
    crudUpdate,
    dispatchCrudUpdate,
    getTreeState,
    isDragging,
    onSelect,
    onToggleItem,
    onUnselectItems,
    parentSource,
    startUndoable,
    translate,
    undoable,
    undoableDragDrop,
    ...rest
}) => rest;

export class NodeView extends Component {
    static propTypes = {
        actions: PropTypes.node,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        node: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    handleClick = event => {
        event.persist();
        // This ensure clicking on a button does not collapse/expand a node
        // When clicking on the form (empty spaces around buttons) however, it should
        // propagate to the parent
        if (!event.target.matches(`.${CONTAINER_CLASS}`)) {
            event.stopPropagation();
        }
    };

    render() {
        const { actions, basePath, children, classes, node, resource, ...props } = this.props;

        return (
            <div
                className={classNames(CONTAINER_CLASS, classes.root)}
                onClick={this.handleClick}
                {...sanitizeRestProps(props)}
            >
                {Children.map(children, field =>
                    field
                        ? cloneElement(field, {
                              basePath: field.props.basePath || basePath,
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
                    })}
            </div>
        );
    }
}

export default withStyles(styles)(NodeView);
