import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import IconGetApp from '@material-ui/icons/GetApp';
import { useTranslate } from 'react-admin';

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

function RootDropTarget({
    canDrop,
    classes: classesOverride,
    connectDropTarget,
    isOverCurrent,
}) {
    const classes = useStyles({ classes: classesOverride });
    const translate = useTranslate();

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
}

RootDropTarget.propTypes = {
    canDrop: PropTypes.bool,
    classes: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired,
    isOverCurrent: PropTypes.bool,
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

export default React.memo(
    DropTarget(DROP_TARGET_TYPE, dropTargetSpecs, dropTargetConnect)(
        RootDropTarget
    ),
    (prevProps, nextProps) =>
        prevProps.canDrop === nextProps.canDrop &&
        prevProps.isOverCurrent === nextProps.isOverCurrent
);
