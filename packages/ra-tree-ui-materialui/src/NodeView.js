import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader, IconButton, createStyles } from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme =>
    createStyles({
        root: {
            marginBottom: theme.spacing.unit,
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

export class NodeView extends Component {
    static propTypes = {
        actions: PropTypes.node,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        item: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    handleCollapse = () => {
        const { onCollapse, item } = this.props;
        onCollapse(item.id);
    };

    handleExpand = () => {
        const { onExpand, item } = this.props;
        onExpand(item.id);
    };

    render() {
        const {
            actions,
            children,
            classes,
            item,
            provided,
            onCollapse,
            onExpand,
            ...props
        } = this.props;

        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <div {...provided.dragHandleProps}>
                            <DragHandleIcon />
                        </div>
                    }
                    action={
                        <>
                            {actions
                                ? cloneElement(actions, {
                                      record: item.data,
                                      ...props,
                                  })
                                : null}
                            {item.hasChildren ? (
                                item.isExpanded ? (
                                    <IconButton onClick={this.handleCollapse}>
                                        <ExpandLessIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={this.handleExpand}>
                                        <ExpandMoreIcon />
                                    </IconButton>
                                )
                            ) : (
                                <IconButton disabled /> // Used as spacer to ensure actions buttons are aligned
                            )}
                        </>
                    }
                    title={item.data.name}
                />
            </Card>
        );
    }
}

export default withStyles(styles)(NodeView);
