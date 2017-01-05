import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import ListButton from '../button/ListButton';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import RecordForm from './RecordForm'; // eslint-disable-line import/no-named-as-default
import DefaultActions from './CreateActions';
import getDefaultValues from './getDefaultValues';

class Create extends Component {
    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit = (record) => this.props.crudCreate(this.props.resource, record, this.getBasePath());

    render() {
        const { actions = <DefaultActions/>, children, defaultValue = {}, isLoading, resource, title, validation } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                {actions && React.cloneElement(actions, {
                    basePath,
                    resource,
                })}
                <CardTitle title={<Title title={title} defaultTitle={`Create ${inflection.humanize(inflection.singularize(resource))}`} />} />
                <RecordForm
                    onSubmit={this.handleSubmit}
                    resource={resource}
                    basePath={basePath}
                    validation={validation}
                    record={{}}
                    initialValues={getDefaultValues(children)({}, defaultValue)}
                >
                    {children}
                </RecordForm>
            </Card>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.node,
    crudCreate: PropTypes.func.isRequired,
    defaultValue: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    validation: PropTypes.func,
};

Create.defaultProps = {
    data: {},
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
