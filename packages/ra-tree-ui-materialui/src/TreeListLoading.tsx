import React from 'react';
import List from '@material-ui/core/List';
import { createStyles, withStyles } from '@material-ui/core/styles';
import TreeNode from './TreeNode';

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const DummyRecord = {};

const TreeListLoading = ({ nbFakeLines = 5, ...props }) => (
    <List dense disablePadding {...sanitizeRestProps(props)}>
        {times(nbFakeLines, key => (
            // @ts-ignore
            <TreeNode key={key} record={DummyRecord} {...props}>
                <Placeholder />
            </TreeNode>
        ))}
    </List>
);

export default TreeListLoading;

const sanitizeRestProps = ({
    basePath,
    children,
    classes,
    closeNode,
    data,
    expandNode,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    history,
    loading,
    locale,
    location,
    match,
    nodes,
    options,
    parentSource,
    permissions,
    positionSource,
    resource,
    toggleNode,
    version,
    ...rest
}: any) => rest;

const RawPlaceholder = ({ classes }) => (
    <div className={classes.root}>&nbsp;</div>
);

const styles = theme =>
    createStyles({
        root: {
            backgroundColor: theme.palette.grey[300],
            width: 256,
        },
    });

const Placeholder = withStyles(styles)(RawPlaceholder);
