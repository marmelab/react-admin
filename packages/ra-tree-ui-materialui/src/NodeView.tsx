import React, { Component, cloneElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    IconButton,
    createStyles,
    Theme,
    WithStyles,
} from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Identifier, Record, Translate } from 'ra-core';
import { TreeItem } from 'ra-tree-core';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginBottom: theme.spacing.unit,
        },
    });

interface Props {
    basePath: string;
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
            basePath,
            children,
            classes,
            item,
            provided,
            onCollapse,
            onExpand,
            positionSource,
            translate,
            ...props
        } = this.props;

        return (
            <Card className={classes.root} {...props}>
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
                                      basePath,
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
