import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import inflection from 'inflection';
import Title from '../layout/Title';
import ListButton from '../button/ListButton';
import SaveButton from '../button/SaveButton';
import { crudGetOne as crudGetOneAction, crudUpdate as crudUpdateAction } from '../../actions/dataActions';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { record: props.data };
    }

    componentDidMount() {
        this.props.crudGetOne(this.props.resource, this.props.id, this.getBasePath());
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ record: nextProps.data }); // FIXME: erases user entry when fetch response arrives late
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(nextProps.resource, nextProps.id, this.getBasePath());
        }
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
        const { title, children, id, data, isLoading, resource } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={basePath} />
                </CardActions>
                <CardTitle title={<Title title={title} record={data} defaultTitle={`${inflection.humanize(inflection.singularize(resource))} #${id}`} />} />
                <form onSubmit={::this.handleSubmit}>
                    <div style={{ padding: '0 1em 1em 1em' }}>
                    {this.state && this.state.record ?
                        React.Children.map(children, input => (
                            <div key={input.props.source}>
                                <input.type
                                    {...input.props}
                                    resource={resource}
                                    record={this.state.record}
                                    onChange={::this.handleChange}
                                    basePath={basePath}
                                />
                            </div>
                        ))
                        :
                        ''
                    }
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
