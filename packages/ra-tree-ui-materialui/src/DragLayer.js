/**
 * Custom DragLayer from Alejandro Hernandez
 * See https://github.com/react-dnd/react-dnd/issues/592#issuecomment-399287474
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';

const useStyles = makeStyles({
    layer: {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    item: {},
});

function CustomDragLayer({
    classes: classesOverride,
    beingDragged,
    dragPreviewComponent: DragPreview,
    itemBeingDragged,
    offset,
}) {
    const classes = useStyles({ classes: classesOverride });

    if (!beingDragged || !offset) return null;

    return (
        <div className={classes.layer}>
            <div
                role="presentation"
                className={classes.item}
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
            >
                <DragPreview node={itemBeingDragged} />
            </div>
        </div>
    );
}

CustomDragLayer.propTypes = {
    beingDragged: PropTypes.bool,
    classes: PropTypes.object,
    dragPreviewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]).isRequired,
    itemBeingDragged: PropTypes.object,
    offset: PropTypes.object,
};

export default React.memo(
    DragLayer(monitor => ({
        itemBeingDragged: monitor.getItem(),
        componentType: monitor.getItemType(),
        beingDragged: monitor.isDragging(),
        offset: monitor.getSourceClientOffset(),
    }))(CustomDragLayer),
    (prevProps, nextProps) => isEqual(prevProps.offset, nextProps.offset)
);
