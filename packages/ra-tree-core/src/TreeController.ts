import { Component, ReactElement, ComponentType } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { Identifier, withTranslate, Translate } from 'ra-core';
import { getTreeRootNodes } from './selectors';
import {
    crudGetTreeRootNodes as crudGetTreeRootNodesAction,
    closeNode as closeNodeAction,
    expandNode as expandNodeAction,
    toggleNode as toggleNodeAction,
} from './actions';

export type NodeFunction = (nodeId: Identifier) => void;

export type TreeControllerChildrenFunction = (params: {
    basePath: string;
    closeNode: NodeFunction;
    expandNode: NodeFunction;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    nodes: Identifier[];
    parentSource: string;
    positionSource: string;
    resource: string;
    toggleNode: NodeFunction;
    [key: string]: any;
}) => ReactElement<any>;

interface Props {
    children: TreeControllerChildrenFunction;
    parentSource: string;
    positionSource: string;
}

interface InjectedProps {
    basePath: string;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    resource: string;
    translate: Translate;
}

interface StateProps {
    loading: boolean;
    rootNodes: Identifier[];
    version: number;
}

interface DispatchProps {
    closeNode: typeof closeNodeAction;
    crudGetTreeRootNodes: typeof crudGetTreeRootNodesAction;
    expandNode: typeof expandNodeAction;
    toggleNode: typeof toggleNodeAction;
}

export class TreeControllerView extends Component<
    Props & InjectedProps & StateProps & DispatchProps
> {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
        closeNode: PropTypes.func.isRequired,
        expandNode: PropTypes.func.isRequired,
        parentSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
        toggleNode: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.updateData(this.props);
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.version !== this.props.version ||
            prevProps.resource !== this.props.resource
        ) {
            this.updateData(this.props);
        }
    }

    updateData = props => {
        props.crudGetTreeRootNodes({
            resource: props.resource,
            parentSource: props.parentSource,
            positionSource: props.positionSource,
        });
    };
    handleCloseNode = nodeId =>
        this.props.closeNode({ resource: this.props.resource, nodeId });

    handleExpandNode = nodeId =>
        this.props.expandNode({ resource: this.props.resource, nodeId });

    handleToggleNode = nodeId =>
        this.props.toggleNode({ resource: this.props.resource, nodeId });

    render() {
        const {
            children,
            closeNode,
            crudGetTreeRootNodes,
            expandNode,
            parentSource,
            resource,
            rootNodes,
            toggleNode,
            translate,
            ...props
        } = this.props;

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 2,
            _: inflection.humanize(inflection.pluralize(resource)),
        });
        const defaultTitle = translate('ra.page.list', {
            name: resourceName,
        });

        console.log({ loading: props.loading });

        return children({
            defaultTitle,
            parentSource,
            nodes: rootNodes,
            closeNode: this.handleCloseNode,
            expandNode: this.handleExpandNode,
            toggleNode: this.handleToggleNode,
            resource,
            ...props,
        });
    }
}

const mapStateToProps = (state, { resource }) => ({
    rootNodes: getTreeRootNodes(state, resource),
    loading: state.admin.loading > 0,
    version: state.admin.ui.viewVersion,
});

const TreeController = compose<any, Props>(
    connect(
        mapStateToProps,
        {
            crudGetTreeRootNodes: crudGetTreeRootNodesAction,
            closeNode: closeNodeAction,
            expandNode: expandNodeAction,
            toggleNode: toggleNodeAction,
        }
    ),
    withTranslate
)(TreeControllerView);

TreeController.defaultProps = {
    parentSource: 'parent_id',
};

export default TreeController as ComponentType<Props>;
