import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import inflection from 'inflection';
import InputList from './InputList';
import Title from '../layout/Title';
import { ListButton, DeleteButton, SaveButton } from '../button';
import { crudGetOne as crudGetOneAction, crudUpdate as crudUpdateAction } from '../../actions/dataActions';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { record: props.data };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        return nextProps.isLoading !== this.props.isLoading
            || nextProps.children.every((child, index) => child === this.props.children[index]);
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleChange(key, value) {
        this.setState({ record: { ...this.state.record, [key]: value } });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudUpdate(this.props.resource, this.props.id, this.state.record, this.getBasePath());
    }

    render() {
        const { title, children, id, data, isLoading, resource, hasDelete } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={basePath} />
                    {hasDelete && <DeleteButton basePath={basePath} record={data} />}
                </CardActions>
                <CardTitle title={<Title title={title} record={data} defaultTitle={`${inflection.humanize(inflection.singularize(resource))} #${id}`} />} />
                <form onSubmit={this.handleSubmit}>
                    <div style={{ padding: '0 1em 1em 1em' }}>
                        <InputList record={this.state.record} inputs={children} resource={resource} handleChange={this.handleChange} basePath={basePath} />
                    </div>
                    <Toolbar>
                        <ToolbarGroup>
                            <SaveButton />
                        </ToolbarGroup>
                    </Toolbar>
                </form>
            </Card>
        );
    }
}

Edit.propTypes = {
    title: PropTypes.any,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    hasDelete: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    crudUpdate: PropTypes.func.isRequired,
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
