import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import DefaultActions from './CreateActions';
import getDefaultValues from '../form/getDefaultValues';
import Translate from '../../i18n/Translate';

class Create extends Component {
    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit = (record) => this.props.crudCreate(this.props.resource, record, this.getBasePath());

    render() {
        const { actions = <DefaultActions />, children, isLoading, resource, title, translate } = this.props;
        const basePath = this.getBasePath();
        const createItemLabel = translate(
            'aor.action.create_item',
            { name: inflection.humanize(inflection.singularize(resource)) },
        );

        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                {actions && React.cloneElement(actions, {
                    basePath,
                    resource,
                })}
                <CardTitle title={<Title title={title} defaultTitle={createItemLabel} />} />
                {React.cloneElement(children, {
                    onSubmit: this.handleSubmit,
                    resource,
                    basePath,
                    record: {},
                })}
            </Card>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudCreate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func.isRequired,
};

Create.defaultProps = {
    data: {},
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

export default Translate(connect(
    mapStateToProps,
    { crudCreate: crudCreateAction },
)(Create));
