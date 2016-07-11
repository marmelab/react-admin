import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import ActionList from 'material-ui/svg-icons/action/list';
import { fetchRecord } from './actions';

class Detail extends Component {
    componentDidMount() {
        this.props.fetchRecordAction(this.props.resource, this.getPath(this.props.id));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.fetchRecordAction(nextProps.resource, this.getPath(nextProps.id));
        }
    }

    getPath(id) {
        return `${this.props.path}/${id}`;
    }

    getListLink() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    render() {
        const { title, children, data } = this.props;
        return (
            <Card style={{margin: '2em'}}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <FlatButton label="List" icon={<ActionList />} containerElement={<Link to={this.getListLink()} />}  />
                </CardActions>
                <CardTitle title={title} />
                <List>
                {React.Children.map(children, column => (
                    <ListItem secondaryText={column.props.label} disabled>
                        <column.type { ...column.props } record={data} />
                    </ListItem>
                ))}
                </List>
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
    path: PropTypes.string.isRequired,
    data: PropTypes.object,
};

function mapStateToProps(state, props) {
    return {
        id: props.params.id,
        data: state[props.resource].data[props.params.id],
    };
}

export default connect(
    mapStateToProps,
    { fetchRecordAction: fetchRecord },
)(Detail);
