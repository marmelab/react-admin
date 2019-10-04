import React, {
    Component,
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
} from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import classnames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    withStyles,
    WithStyles,
    Theme,
    StyleRules,
} from '@material-ui/core/styles';
import {
    crudGetTreeChildrenNodes as crudGetTreeChildrenNodesAction,
    getIsExpanded,
    getIsLoading,
    getChildrenNodes,
    NodeFunction,
} from 'ra-tree-core';
import { withTranslate, Record, Identifier, Translate } from 'ra-core';
import TreeNodeList from './TreeNodeList';

interface Props {
    basePath: string;
    className?: string;
    closeNode: NodeFunction;
    crudGetTreeChildrenNodes: typeof crudGetTreeChildrenNodesAction;
    expanded: boolean;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    loading: boolean;
    nodeChildren: ReactElement<any>;
    nodes: Identifier[];
    parentSource: string;
    positionSource: string;
    record: Record;
    resource: string;
    expandNode: NodeFunction;
    toggleNode: NodeFunction;
    translate: Translate;
}
class TreeNode extends Component<Props & WithStyles<typeof styles>> {
    componentDidMount() {
        this.fetchChildren();
    }

    handleClick = () => {
        this.props.toggleNode(this.props.record.id);

        // If the node wasn't expanded, the previous line is actually requesting
        // it to expand, so we reload its children to be sure they are up to date
        if (!this.props.expanded) {
            this.fetchChildren();
        }
    };

    fetchChildren = () => {
        this.props.crudGetTreeChildrenNodes({
            resource: this.props.resource,
            parentSource: this.props.parentSource,
            positionSource: this.props.positionSource,
            nodeId: this.props.record.id,
        });
    };

    render() {
        const {
            basePath,
            children,
            className,
            classes,
            closeNode,
            crudGetTreeChildrenNodes,
            expanded,
            expandNode,
            hasCreate,
            hasEdit,
            hasList,
            hasShow,
            loading,
            nodeChildren,
            nodes,
            parentSource,
            positionSource,
            record,
            resource,
            toggleNode,
            translate,
            ...props
        } = this.props;

        if (!record) {
            return null;
        }

        return (
            <ListItem
                className={classnames(classes.root, className)}
                {...props}
            >
                <div className={classes.container}>
                    <ListItemIcon>
                        {loading ? (
                            <div className={classes.icon}>
                                <CircularProgress size="1em" />
                            </div>
                        ) : !nodes || nodes.length === 0 ? (
                            <div className={classes.icon}>
                                <KeyboardArrowRight />
                            </div>
                        ) : (
                            <IconButton
                                className={classes.button}
                                disableRipple
                                aria-label={translate(
                                    expanded
                                        ? 'ra.tree.close'
                                        : 'ra.tree.expand'
                                )}
                                title={translate(
                                    expanded
                                        ? 'ra.tree.close'
                                        : 'ra.tree.expand'
                                )}
                                onClick={this.handleClick}
                            >
                                {expanded ? (
                                    <KeyboardArrowDown />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </IconButton>
                        )}
                    </ListItemIcon>
                    <div className={classes.content}>
                        {Children.map(children, child =>
                            isValidElement(child)
                                ? cloneElement<any>(child, { record })
                                : null
                        )}
                    </div>
                </div>
                {expanded ? (
                    <TreeNodeList
                        basePath={basePath}
                        closeNode={closeNode}
                        expandNode={expandNode}
                        hasCreate={hasCreate}
                        hasEdit={hasEdit}
                        hasList={hasList}
                        hasShow={hasShow}
                        nodes={nodes}
                        parentSource={parentSource}
                        positionSource={positionSource}
                        resource={resource}
                        toggleNode={toggleNode}
                    >
                        {nodeChildren}
                    </TreeNodeList>
                ) : null}
            </ListItem>
        );
    }
}

const styles = (theme: Theme): StyleRules => ({
    root: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    container: {
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
        verticalAlign: 'middle',
    },
    content: {
        display: 'inline-flex',
    },
    button: {
        height: theme.spacing.unit * 3,
        width: theme.spacing.unit * 3,
    },
    icon: {
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        fontSize: '1.5rem',
        height: theme.spacing.unit * 3,
        justifyContent: 'baseline',
        position: 'relative',
        verticalAlign: 'middle',
        width: theme.spacing.unit * 3,
    },
});

const mapStateToProps = (state, { record, resource }) => ({
    expanded: getIsExpanded(state, resource, record ? record.id : undefined),
    loading: getIsLoading(state, resource, record ? record.id : undefined),
    nodes: getChildrenNodes(state, resource, record ? record.id : undefined),
});

export default compose(
    connect(
        mapStateToProps,
        { crudGetTreeChildrenNodes: crudGetTreeChildrenNodesAction }
    ),
    withTranslate,
    withStyles(styles)
)(TreeNode);
