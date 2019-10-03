import React, { Children, Component, ReactElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { TreeController } from 'ra-tree-core';

interface Props {
    basePath: string;
    children: ReactElement<any>;
    parentSource: string;
    positionSource: string;
    resource: string;
}

export class Tree extends Component<Props> {
    static propTypes = {
        allowDropOnRoot: PropTypes.bool,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        enableDragAndDrop: PropTypes.bool,
        parentSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
    };

    static defaultProps = {
        classes: {},
        parentSource: 'parent_id',
        positionSource: 'position',
    };

    componentDidMount() {
        const childrenCount = Children.count(this.props.children);

        if (childrenCount > 1 && process.env.NODE_ENV !== 'production') {
            warnAboutChildren();
        }
    }

    render() {
        const { children, parentSource, positionSource, ...props } = this.props;
        return (
            <TreeController
                parentSource={parentSource}
                positionSource={positionSource}
                {...props}
            >
                {controllerProps => (
                    <TreeView {...controllerProps}>{children}</TreeView>
                )}
            </TreeController>
        );
    }
}

const TreeView = ({ children, ...props }) => cloneElement(children, props);

export default Tree;

const warnAboutChildren = () =>
    console.warn(
        // eslint-disable-line
        `You passed multiple children to the Tree component.

    <Tree>
        <NodeView>
            <TextField source="name" />
        </NodeView>
    </Tree>

    // Or

    <Tree>
        <NodeForm>
            <TextInput source="name" />
        </NodeForm>
    </Tree>

If you need actions on each node, use the actions prop on either the NodeView or NodeForm component:

    const MyNodeActions = props => (
        <NodeActions {...props}>
            <EditButton />
            <ShowButton />
            <DeleteButton />
        </NodeActions>
    );

    <Tree>
        <NodeView actions={<MyNodeActions />}>
            <TextField source="name" />
        </NodeView>
    </Tree>

    // Or

    const MyNodeActions = props => (
        <NodeActions {...props}>
            <SaveButton variant="flat" />
            <IgnoreFormProps>
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </IgnoreFormProps>
        </NodeActions>
    );

    <Tree>
        <NodeForm actions={<MyNodeActions />}>
            <TextInput source="name" />
        </NodeForm>
    </Tree>
`
    );
