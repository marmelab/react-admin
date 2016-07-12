import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ActionList from 'material-ui/svg-icons/action/list';
import ContentSave from 'material-ui/svg-icons/content/save';
import { crudCreate as crudCreateAction } from '../data/actions';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = { record: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ record: nextProps.data }); // FIXME: erases user entry when fetch response arrives late
    }

    getListLink() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleChange(event) {
        this.setState({ record: { ...this.state.record, [event.currentTarget.dataset.key]: event.target.value } });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudCreate(this.props.resource, this.state.record);
    }

    render() {
        const { title, children, data } = this.props;
        return (
            <Card style={{margin: '2em'}}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <FlatButton label="List" icon={<ActionList />} containerElement={<Link to={this.getListLink()} />}  />
                </CardActions>
                <CardTitle title={title} />
                <form onSubmit={this.handleSubmit}>
                    <div style={{ padding: '0 1em 1em 1em' }}>
                    {this.state ?
                        React.Children.map(children, input => (
                            <div key={input.props.source}>
                            <input.type { ...input.props } record={this.state.record} onChange={this.handleChange} />
                            </div>
                        ))
                        :
                        'not good'
                    }
                    </div>
                    <Toolbar>
                        <ToolbarGroup>
                            <FlatButton type="submit" label="Save" icon={<ContentSave />} />
                        </ToolbarGroup>
                    </Toolbar>
                </form>
            </Card>
        );
    }
}

Create.propTypes = {
    title: PropTypes.string,
    resource: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    crudCreate: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return { };
}

export default connect(
    mapStateToProps,
    { crudCreate: crudCreateAction },
)(Create);
