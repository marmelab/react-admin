import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';
import { crudFetch as crudFetchAction, GET_ONE } from '../data/actions';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = props.data;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.crudFetch(this.props.resource, GET_ONE, { id: this.props.id });
    }

    componentWillReceiveProps(nextProps) {
        this.state = nextProps.data; // FIXME: erases user entry when fetch response arrives late
        if (this.props.id !== nextProps.id) {
            this.props.crudFetch(nextProps.resource, GET_ONE, { id: nextProps.id });
        }
    }

    getListLink() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleChange(event) {
        this.setState({ [event.currentTarget.dataset.key]: event.target.value })
    }

    render() {
        const { title, children, data } = this.props;
        return (
            <Card style={{margin: '2em'}}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <FlatButton label="List" icon={<ActionList />} containerElement={<Link to={this.getListLink()} />}  />
                </CardActions>
                <CardTitle title={title} />
                <div style={{ padding: '0 1em' }}>
                    {this.state ?
                        React.Children.map(children, input => (
                            <div key={input.props.source}>
                            <input.type { ...input.props } record={this.state} onChange={this.handleChange} />
                            </div>
                        ))
                        :
                        ''
                    }
                </div>
            </Card>
        );
    }
}

Detail.PropTypes = {
    title: PropTypes.string,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object,
    crudFetch: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: props.params.id,
        data: state[props.resource].data[props.params.id],
    };
}

export default connect(
    mapStateToProps,
    { crudFetch: crudFetchAction },
)(Detail);
