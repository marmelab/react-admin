import React, { ReactElement, SFC, ComponentType } from 'react';

import TreeNodeList from './TreeNodeList';
import TreeListLoading from './TreeListLoading';

interface Props {
    children: ReactElement<any>;
}

interface InjectedProps {
    loading: boolean;
    nodes: any[];
}

const TreeList: SFC<Props & InjectedProps> = ({
    children,
    loading,
    ...props
}) =>
    loading && props.nodes.length === 0 ? (
        <TreeListLoading />
    ) : (
        <TreeNodeList {...props}>{children}</TreeNodeList>
    );

export default TreeList as ComponentType<Props>;
