import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ListButton from '../button/ListButton';
import SaveButton from '../button/SaveButton';
import { crudCreate as crudCreateAction } from '../../../actions/dataActions';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = { record: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        this.props.crudCreate(this.props.resource, this.state.record, this.getBasePath());
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
                        'not good'
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

Create.propTypes = {
    title: PropTypes.string,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
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
