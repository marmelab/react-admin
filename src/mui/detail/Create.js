import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import inflection from 'inflection';
import Title from '../layout/Title';
import ListButton from '../button/ListButton';
import SaveButton from '../button/SaveButton';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import RecordForm from './RecordForm';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = { record: {} };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudCreate(this.props.resource, this.state.record, this.getBasePath());
    }

    render() {
        const { title, children, data, isLoading, resource } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={basePath} />
                </CardActions>
                <CardTitle title={<Title title={title} record={data} defaultTitle={`Create ${inflection.humanize(inflection.singularize(resource))}`} />} />
                <RecordForm onSubmit={this.handleSubmit}>
                    {children}
                </RecordForm>
            </Card>
        );
    }
}

Create.propTypes = {
    title: PropTypes.any,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    crudCreate: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

export default connect(
    mapStateToProps,
    { crudCreate: crudCreateAction },
)(Create);
