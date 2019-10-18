import { Component, ReactElement, ComponentType } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { Identifier, withTranslate, Translate } from 'ra-core';
import { getTreeRootNodes } from './selectors';
import { crudGetTreeRootNodes as crudGetTreeRootNodesAction } from './actions';

export type TreeControllerChildrenFunction = (params: {
    basePath: string;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    nodes: Identifier[];
    parentSource: string;
    positionSource: string;
    resource: string;
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
    crudGetTreeRootNodes: typeof crudGetTreeRootNodesAction;
}

export class TreeController extends Component<
    Props & InjectedProps & StateProps & DispatchProps
> {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
        parentSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
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

    render() {
        const {
            children,
            crudGetTreeRootNodes,
            parentSource,
            resource,
            rootNodes,
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

        return children({
            defaultTitle,
            parentSource,
            nodes: rootNodes,
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

const EnhancedTreeController = compose<any, Props>(
    connect(
        mapStateToProps,
        {
            crudGetTreeRootNodes: crudGetTreeRootNodesAction,
        }
    ),
    withTranslate
)(TreeController);

EnhancedTreeController.defaultProps = {
    parentSource: 'parent_id',
};

export default EnhancedTreeController as ComponentType<Props>;
