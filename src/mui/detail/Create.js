import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import DefaultActions from './CreateActions';
import getDefaultValues from '../form/getDefaultValues';

class Create extends Component {
    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit = (record) => this.props.crudCreate(this.props.resource, record, this.getBasePath());

    render() {
        const { actions = <DefaultActions />, children, defaultValue = {}, isLoading, resource, title } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                {actions && React.cloneElement(actions, {
                    basePath,
                    resource,
                })}
                <CardTitle title={<Title title={title} defaultTitle={`Create ${inflection.humanize(inflection.singularize(resource))}`} />} />
                {React.cloneElement(children, {
                    onSubmit: this.handleSubmit,
                    resource,
                    basePath,
                    record: {},
                    initialValues: getDefaultValues(Children.toArray(children))({}, defaultValue),
                })}
            </Card>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudCreate: PropTypes.func.isRequired,
    defaultValue: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
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
