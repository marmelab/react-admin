import React, { cloneElement } from 'react';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import { createStyles } from '@material-ui/core/styles';
import { Title } from 'ra-ui-materialui';

import TreeNodeList from './TreeNodeList';
import TreeListLoading from './TreeListLoading';
import TreeListActions from './TreeListActions';
import TreeListToolbar from './TreeListToolbar';

const TreeList = ({
    actions = <TreeListActions />,
    aside,
    children,
    className,
    classes,
    defaultTitle,
    exporter,
    filter,
    loading,
    title,
    version,
    ...props
}) => (
    <div
        className={classnames('tree-page', classes.root, className)}
        {...sanitizeRestProps(props)}
    >
        <Title title={title} defaultTitle={defaultTitle} />
        <Card className={classes.card}>
            {actions && (
                <TreeListToolbar
                    {...props}
                    actions={actions}
                    exporter={exporter}
                    permanentFilter={filter}
                />
            )}
            {loading && props.nodes.length === 0 ? (
                <TreeListLoading />
            ) : (
                <div key={version}>
                    <TreeNodeList {...props}>{children}</TreeNodeList>
                </div>
            )}
        </Card>
        {aside && cloneElement(aside, props)}
    </div>
);

export default TreeList;

export const styles = createStyles({
    root: {
        display: 'flex',
        flex: 1,
    },
    card: {
        position: 'relative',
        flex: '1 1 auto',
    },
    actions: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
    noResults: { padding: 20 },
});

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
