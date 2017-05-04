import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'material-ui/Card';
import compose from 'recompose/compose';
import inflection from 'inflection';
import ViewTitle from '../layout/ViewTitle';
import Title from '../layout/Title';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import DefaultActions from './CreateActions';
import translate from '../../i18n/translate';

class Create extends Component {
    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit = (record) => this.props.crudCreate(this.props.resource, record, this.getBasePath());

    render() {
        const { actions = <DefaultActions />, children, isLoading, resource, title, translate } = this.props;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('aor.page.create', {
            name: `${resourceName}`,
        });
        const titleElement = <Title title={title} defaultTitle={defaultTitle} />;

        return (
            <div className="create-page">
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    {actions && React.cloneElement(actions, {
                        basePath,
                        resource,
                    })}
                    <ViewTitle title={titleElement} />
                    {React.cloneElement(children, {
                        onSubmit: this.handleSubmit,
                        resource,
                        basePath,
                        record: {},
                        translate,
                    })}
                </Card>
            </div>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudCreate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
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

const enhance = compose(
    connect(
        mapStateToProps,
        { crudCreate: crudCreateAction },
    ),
    translate,
);

export default enhance(Create);
