import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ListButton from '../button/ListButton';
import SaveButton from '../button/SaveButton';
import { crudGetOne as crudGetOneAction, crudUpdate as crudUpdateAction } from '../actions/dataActions';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { record: props.data };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.crudGetOne(this.props.resource, this.props.id);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ record: nextProps.data }); // FIXME: erases user entry when fetch response arrives late
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(nextProps.resource, nextProps.id);
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleChange(event) {
        this.setState({ record: { ...this.state.record, [event.currentTarget.dataset.key]: event.target.value } });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudUpdate(this.props.resource, this.props.id, this.state.record, this.getBasePath());
    }

    render() {
        const { title, children, data } = this.props;
        return (
            <Card style={{ margin: '2em' }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={this.getBasePath()} />
                </CardActions>
                <CardTitle title={title} />
                <form onSubmit={this.handleSubmit}>
                    <div style={{ padding: '0 1em 1em 1em' }}>
                    {this.state ?
                        React.Children.map(children, input => (
                            <div key={input.props.source}>
                                <input.type {...input.props} record={this.state.record} onChange={this.handleChange} />
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
    title: PropTypes.string,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object,
    crudGetOne: PropTypes.func.isRequired,
    crudUpdate: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: props.params.id,
        data: state[props.resource].data[props.params.id],
    };
}

export default connect(
    mapStateToProps,
    { crudGetOne: crudGetOneAction, crudUpdate: crudUpdateAction },
)(Edit);
