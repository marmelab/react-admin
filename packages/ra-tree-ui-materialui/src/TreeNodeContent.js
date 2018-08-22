import React, { cloneElement, Children, Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconDragHandle from '@material-ui/icons/DragHandle';

const styles = theme => ({
    handle: {
        alignItems: 'center',
        cursor: 'crosshair',
        display: 'flex',
        marginRight: theme.spacing.unit * 2,
    },
});

class TreeNodeContent extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        cancelDropOnChildren: PropTypes.bool,
        containerElement: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
            PropTypes.string,
        ]),
        children: PropTypes.node,
        classes: PropTypes.object.isRequired,
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
            submit,
            isLeaf,
            node,
            ...props
        } = this.props;
        return (
            <Fragment>
                {// Use empty image as a drag preview so browsers don't draw it
                // and we can draw whatever we want on the custom drag layer instead.

                connectDragPreview &&
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
                {cloneElement(Children.only(children), { node, ...props })}
            </Fragment>
        );
    }
}

export default withStyles(styles)(TreeNodeContent);
