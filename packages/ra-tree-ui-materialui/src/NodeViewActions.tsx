import React, { Component, cloneElement, ReactElement } from 'react';
import {
    IconButton,
    createStyles,
    Theme,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Identifier, Record } from 'ra-core';
import { TreeItem } from 'ra-tree-core';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            width: theme.spacing.unit * 4,
            fontSize: '0.8125rem',
            height: theme.spacing.unit * 4,
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
}

class NodeViewActions extends Component<Props & WithStyles<typeof styles>> {
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
            classes,
            item,
            onCollapse,
            onExpand,
            ...props
        } = this.props;

        return (
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
                        <IconButton
                            className={classes.button}
                            onClick={this.handleCollapse}
                        >
                            <ExpandLessIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            className={classes.button}
                            onClick={this.handleExpand}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    )
                ) : (
                    // Used as spacer to ensure actions buttons are aligned
                    <IconButton className={classes.button} disabled />
                )}
            </>
        );
    }
}

export default withStyles(styles)(NodeViewActions);
