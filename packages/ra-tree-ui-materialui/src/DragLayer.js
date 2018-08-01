/**
 * Custom DragLayer from Alejandro Hernandez
 * See https://github.com/react-dnd/react-dnd/issues/592#issuecomment-399287474
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
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

let subscribedToOffsetChange = false;

let dragPreviewRef = null;

const onOffsetChange = monitor => () => {
    if (!dragPreviewRef) return;

    const offset = monitor.getSourceClientOffset();
    if (!offset) return;

    const transform = `translate(${offset.x}px, ${offset.y}px)`;
    dragPreviewRef.style['transform'] = transform;
    dragPreviewRef.style['-webkit-transform'] = transform;
};

class CustomDragLayer extends React.PureComponent {
    static propTypes = {
        beingDragged: PropTypes.bool,
        classes: PropTypes.object.isRequired,
        dragPreviewComponent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
        ]).isRequired,
        itemBeingDragged: PropTypes.object,
    };

    componentDidUpdate() {
        dragPreviewRef = this.rootNode;
    }

    render() {
        const {
            classes,
            beingDragged,
            dragPreviewComponent: DragPreview,
            itemBeingDragged,
        } = this.props;

        if (!beingDragged) return null;
        return (
            <div
                role="presentation"
                ref={el => (this.rootNode = el)}
                className={classes.layer}
            >
                <DragPreview node={itemBeingDragged} />
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    DragLayer(monitor => {
        if (!subscribedToOffsetChange) {
            monitor.subscribeToOffsetChange(onOffsetChange(monitor));
            subscribedToOffsetChange = true;
        }

        return {
            itemBeingDragged: monitor.getItem(),
            componentType: monitor.getItemType(),
            beingDragged: monitor.isDragging(),
        };
    })
)(CustomDragLayer);
