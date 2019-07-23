import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    Divider,
    createStyles,
    Theme,
    WithStyles,
} from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Identifier, Record, Translate } from 'ra-core';
import { TreeItem } from 'ra-tree-core';
import NodeViewActions from './NodeViewActions';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginBottom: 0,
        },
        header: {
            paddingBottom: theme.spacing.unit,
            paddingTop: theme.spacing.unit * 2,
        },
    });

interface Props {
    basePath: string;
    resource: string;
    onCollapse: (itemId: Identifier) => void;
    onExpand: (itemId: Identifier) => void;
    item: TreeItem;
    actions?: ReactElement<{
        basePath: string;
        record: Record;
    }>;
    positionSource: string;
    provided: any;
    translate: Translate;
    hasCreate: boolean;
    hasEdit: boolean;
    hasShow: boolean;
    hasList: boolean;
}

export class NodeView extends Component<Props & WithStyles<typeof styles>> {
    static propTypes = {
        actions: PropTypes.node,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        item: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    render() {
        const {
            actions,
            basePath,
            children,
            classes,
            hasCreate,
            hasEdit,
            hasShow,
            hasList,
            item,
            provided,
            onCollapse,
            onExpand,
            positionSource,
            translate,
            resource,
            ...props
        } = this.props;

        return (
            <Card className={classes.root} elevation={0} {...props}>
                <CardHeader
                    className={classes.header}
                    avatar={
                        <div {...provided.dragHandleProps}>
                            <DragHandleIcon />
                        </div>
                    }
                    action={
                        <NodeViewActions
                            basePath={basePath}
                            resource={resource}
                            actions={actions}
                            onExpand={onExpand}
                            onCollapse={onCollapse}
                            item={item}
                        />
                    }
                    title={item.data.name}
                />
                <Divider />
            </Card>
        );
    }
}

export default withStyles(styles)(NodeView);
