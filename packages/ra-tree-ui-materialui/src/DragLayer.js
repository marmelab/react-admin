import React from 'react';
import PropTypes from 'prop-types';
import { DragLayer as DndDragLayer } from 'react-dnd';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    layer: {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
};

const getItemStyles = props => {
    const { currentOffset } = props;
    if (!currentOffset) {
        return {
            display: 'none',
        };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform: transform,
        WebkitTransform: transform,
    };
};

const DragLayer = ({
    classes,
    dragPreviewComponent: DragPreview,
    isDragging,
    item,
    ...props
}) => {
    if (!isDragging) {
        return null;
    }

    return (
        <div className={classes.layer}>
            <DragPreview node={item} style={getItemStyles(props)} />
        </div>
    );
};

DragLayer.propTypes = {
    classes: PropTypes.object.isRequired,
    dragPreviewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    isDragging: PropTypes.bool,
    item: PropTypes.object,
};

export default compose(
    withStyles(styles),
    DndDragLayer(monitor => ({
        item: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }))
)(DragLayer);
