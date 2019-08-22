import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const CONTAINER_CLASS = 'treenode-content';

const useStyles = makeStyles({
    root: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
    },
});

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

function NodeView({
    actions,
    basePath,
    children,
    classes: classesOverride,
    node,
    resource,
    ...props
}) {
    const classes = useStyles({ classes: classesOverride });

    const handleClick = event => {
        event.persist();
        // This ensure clicking on a button does not collapse/expand a node
        // When clicking on the form (empty spaces around buttons) however, it should
        // propagate to the parent
        if (!event.target.matches(`.${CONTAINER_CLASS}`)) {
            event.stopPropagation();
        }
    };

    return (
        <div
            className={classNames(CONTAINER_CLASS, classes.root)}
            onClick={handleClick}
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

NodeView.propTypes = {
    actions: PropTypes.node,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    node: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
};

export default NodeView;
