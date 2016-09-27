import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import { ListButton, DeleteButton } from '../button';
import { crudGetOne as crudGetOneAction, crudUpdate as crudUpdateAction } from '../../actions/dataActions';
import RecordForm from './RecordForm'; // eslint-disable-line import/no-named-as-default

/**
 * Turns a children data structure (either single child or array of children) into an array.
 * We can't use React.Children.toArray as it loses references.
 */
const arrayizeChildren = children => (Array.isArray(children) ? children : [children]);

export class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { record: props.data };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.crudGetOne(this.props.resource, this.props.id, this.getBasePath());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({ record: nextProps.data }); // FIXME: erases user entry when fetch response arrives late
        }
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
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit(record) {
        this.props.crudUpdate(this.props.resource, this.props.id, record, this.getBasePath());
    }

    render() {
        const { title, children, id, data, isLoading, resource, hasDelete, validation } = this.props;
        const basePath = this.getBasePath();

        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={basePath} />
                    {hasDelete && <DeleteButton basePath={basePath} record={data} />}
                </CardActions>
                <CardTitle title={<Title title={title} record={data} defaultTitle={`${inflection.humanize(inflection.singularize(resource))} #${id}`} />} />
                {data && <RecordForm
                    onSubmit={this.handleSubmit}
                    record={data}
                    resource={resource}
                    basePath={basePath}
                    initialValues={data}
                    validation={validation}
                >
                    {children}
                </RecordForm>}
            </Card>
        );
    }
}

Edit.propTypes = {
    children: PropTypes.node,
    crudGetOne: PropTypes.func.isRequired,
    crudUpdate: PropTypes.func.isRequired,
    data: PropTypes.object,
    hasDelete: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
};

function mapStateToProps(state, props) {
    return {
        id: props.params.id,
        data: state.admin[props.resource].data[props.params.id],
        isLoading: state.admin.loading > 0,
    };
}

export default connect(
    mapStateToProps,
    { crudGetOne: crudGetOneAction, crudUpdate: crudUpdateAction },
)(Edit);
