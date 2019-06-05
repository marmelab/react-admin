import React, { cloneElement, Children, Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import IconDragHandle from '@material-ui/icons/DragHandle';

class TreeNodeContent extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        cancelDropOnChildren: PropTypes.bool,
        connectDragPreview: PropTypes.func,
        connectDragSource: PropTypes.func,
        containerElement: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.string]),
        children: PropTypes.node,
        classes: PropTypes.object.isRequired,
        expandNode: PropTypes.func,
        isLeaf: PropTypes.bool,
        node: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
        submit: PropTypes.func,
    };

    static defaultProps = {
        containerElement: 'div',
    };

    render() {
        const {
            children,
            classes,
            connectDragPreview,
            connectDragSource,
            containerElement: Container,
            expandNode,
            submit,
            isLeaf,
            node,
            ...props
        } = this.props;
        return (
            <Fragment>
                {cloneElement(Children.only(children), { node, ...props })}
                {connectDragPreview &&
                    connectDragPreview(<span />, {
                        // IE fallback: specify that we'd rather screenshot the node
                        // when it already knows it's being dragged so we can hide it with CSS.
                        captureDraggingState: true,
                    })}
                {connectDragSource &&
                    connectDragSource(
                        <div className={classes.handle}>
                            <IconDragHandle />
                        </div>
                    )}
            </Fragment>
        );
    }
}

export default TreeNodeContent;
