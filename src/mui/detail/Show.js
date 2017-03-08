import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import inflection from 'inflection';
import AppBar from '../layout/AppBar';
import Title from '../layout/Title';
import { DeleteButton, EditButton, ListButton } from '../button';
import { crudGetOne as crudGetOneAction } from '../../actions/dataActions';
import DefaultActions from './ShowActions';
import translate from '../../i18n/translate';

/**
 * Turns a children data structure (either single child or array of children) into an array.
 * We can't use React.Children.toArray as it loses references.
 */
const arrayizeChildren = children => (Array.isArray(children) ? children : [children]);

export class Show extends Component {
    componentDidMount() {
        this.props.crudGetOne(this.props.resource, this.props.id, this.getBasePath());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(nextProps.resource, nextProps.id, this.getBasePath());
        }
    }

    // FIXME Seems that the cloneElement in CrudRoute slices the children array, which makes this necessary to avoid rerenders
    shouldComponentUpdate(nextProps) {
        if (nextProps.isLoading !== this.props.isLoading) {
            return true;
        }

        const currentChildren = arrayizeChildren(this.props.children);
        const newChildren = arrayizeChildren(nextProps.children);

        return newChildren.every((child, index) => child === currentChildren[index]);
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -2).join('/');
    }

    render() {
        const { actions = <DefaultActions />, title, children, id, data, isLoading, resource, hasDelete, hasEdit, translate, width } = this.props;
        const basePath = this.getBasePath();
        const isMobile = width === 1;

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('aor.page.show', {
            name: `${resourceName}`,
            id,
            data,
        });
        const titleElement = data ? <Title title={title} record={data} defaultTitle={defaultTitle} /> : '';

        return (
            <div>
                {isMobile && <AppBar title={titleElement} />}
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    {actions && React.cloneElement(actions, {
                        basePath,
                        data,
                        hasDelete,
                        hasEdit,
                        refresh: this.refresh,
                        resource,
                    })}
                    {!isMobile && <CardTitle title={titleElement} />}
                    {data && React.cloneElement(children, {
                        resource,
                        basePath,
                        record: data,
                    })}
                </Card>
            </div>
        );
    }
}

Show.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudGetOne: PropTypes.func.isRequired,
    data: PropTypes.object,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func,
    width: PropTypes.number,
};

function mapStateToProps(state, props) {
    return {
        id: props.params.id,
        data: state.admin[props.resource].data[props.params.id],
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(
        mapStateToProps,
        { crudGetOne: crudGetOneAction },
    ),
    translate,
    withWidth(),
);

export default enhance(Show);
