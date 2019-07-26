import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import IconGetApp from '@material-ui/icons/GetApp';
import { translate } from 'ra-core';

import { DROP_TARGET_TYPE } from './constants';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(6),
    },
    text: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    hover: {
        backgroundColor: theme.palette.action.active,
    },
}));

const RootDropTarget = ({
    canDrop,
    connectDropTarget,
    isOverCurrent,
    translate,
}) => {
    const classes = useStyles();

    return (
        <ListItem
            className={classNames(classes.root, {
                [classes.hover]: canDrop && isOverCurrent,
            })}
            disabled={!canDrop}
        >
            <IconGetApp />
            {connectDropTarget(
                <div>
                    <Typography className={classes.text}>
                        {translate('ra.tree.root_target')}
                    </Typography>
                </div>
            )}
        </ListItem>
    );
};

RootDropTarget.propTypes = {
    canDrop: PropTypes.bool,
    connectDropTarget: PropTypes.func.isRequired,
    isOverCurrent: PropTypes.bool,
    translate: PropTypes.func.isRequired,
};

const dropTargetSpecs = {
    drop(props, monitor) {
        if (monitor.isOver({ shallow: true })) {
            return { id: null, record: { id: null } };
        }

        return undefined;
    },
    canDrop(props, monitor) {
        const item = monitor.getItem();
        return !!item.parent;
    },
};

const dropTargetConnect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    item: monitor.getItem(),
});

export default compose(
    DropTarget(DROP_TARGET_TYPE, dropTargetSpecs, dropTargetConnect),
    translate
)(
    React.memo(RootDropTarget, (prevProps, nextProps) => {
        return (
            prevProps.canDrop !== nextProps.canDrop ||
            prevProps.isOverCurrent !== nextProps.isOverCurrent
        );
    })
);
