import React, {
    Children,
    Component,
    ReactElement,
    cloneElement,
    SFC,
    ComponentType,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { TreeController } from 'ra-tree-core';
import { Title } from 'ra-ui-materialui';

import TreeListActions from './TreeListActions';
import TreeListToolbar from './TreeListToolbar';
import { Record, Dispatch } from 'ra-core';

type FetchRelatedData = () => void;

type Exporter = (
    data: Record[],
    fetchRelatedData: FetchRelatedData,
    dispatch: Dispatch<any>
) => void;

interface Props {
    actions?: ReactElement<any>;
    aside?: ReactElement<any>;
    children: ReactElement<any>;
    className: string;
    exporter: Exporter;
    filter?: object;
    parentSource: string;
    positionSource?: string;
    title?: string;
}

interface InjectedProps {
    basePath: string;
    resource: string;
    version: number;
}

export class Tree extends Component<Props & InjectedProps> {
    static propTypes = {
        actions: PropTypes.element,
        aside: PropTypes.element,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        className: PropTypes.string,
        exporter: PropTypes.func,
        filter: PropTypes.object,
        parentSource: PropTypes.string.isRequired,
        positionSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
        title: PropTypes.string,
        version: PropTypes.number,
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

export default Tree as ComponentType<Props>;

interface ViewProps {
    defaultTitle: string;
}

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
});

const TreeView = withStyles(styles)(
    ({
        actions = <TreeListActions />,
        aside,
        children,
        className,
        classes,
        defaultTitle,
        exporter,
        filter,
        title,
        version,
        ...props
    }: Props & InjectedProps & ViewProps & WithStyles<typeof styles>) => (
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
                <div key={version}>{cloneElement(children, props)}</div>
            </Card>
            {aside && cloneElement(aside, props)}
        </div>
    )
);

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
