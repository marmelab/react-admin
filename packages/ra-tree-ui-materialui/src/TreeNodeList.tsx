import React, {
    Children,
    SFC,
    cloneElement,
    ReactElement,
    ComponentType,
} from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withStyles, WithStyles, StyleRules } from '@material-ui/core/styles';
import List, { ListProps } from '@material-ui/core/List';
import { Record, Identifier } from 'ra-core';
import { getTreeNodes } from 'ra-tree-core';

interface Props {
    children: ReactElement<any>;
    [key: string]: any;
}

interface InjectedProps {
    basePath: string;
    data: Record[];
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    loading: boolean;
    nodes: Identifier[];
    parentSource: string;
    positionSource: string;
    resource: string;
}

const TreeNodeListView: SFC<
    Props & InjectedProps & WithStyles<typeof styles> & ListProps
> = ({
    basePath,
    children,
    classes,
    data,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    loading,
    nodes,
    parentSource,
    positionSource,
    resource,
    ...props
}) => (
    <List
        classes={{
            root: classes.root,
        }}
        dense
        disablePadding
        {...props}
    >
        {data.map(record =>
            // Necessary because of a possible race condition leading to a null record
            // when user expand/close multiple times very quickly
            record
                ? cloneElement(Children.only(children), {
                      basePath,
                      hasCreate,
                      hasEdit,
                      hasList,
                      hasShow,
                      key: record.id,
                      nodeChildren: children,
                      parentSource,
                      positionSource,
                      record,
                      resource,
                  })
                : null
        )}
    </List>
);

export const styles: StyleRules = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const mapStateToProps = (state, { resource, nodes }) => ({
    data: getTreeNodes(state, resource, nodes),
});

const TreeNodeList = compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        {}
    )
)(TreeNodeListView);

export default TreeNodeList as ComponentType<Props>;
