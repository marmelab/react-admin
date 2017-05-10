import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
import compose from 'recompose/compose';
import inflection from 'inflection';
import ViewTitle from '../layout/ViewTitle';
import Title from '../layout/Title';
import { crudGetOne as crudGetOneAction, crudUpdate as crudUpdateAction } from '../../actions/dataActions';
import DefaultActions from './EditActions';
import translate from '../../i18n/translate';

export class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 0,
            record: props.data,
        };
        this.previousKey = 0;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.updateData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({ record: nextProps.data }); // FIXME: erases user entry when fetch response arrives late
            if (this.fullRefresh) {
                this.fullRefresh = false;
                this.setState({ key: this.state.key + 1 });
            }
        }
        if (this.props.id !== nextProps.id) {
            this.updateData(nextProps.resource, nextProps.id);
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    updateData(resource = this.props.resource, id = this.props.id) {
        this.props.crudGetOne(resource, id, this.getBasePath());
    }

    refresh = (event) => {
        event.stopPropagation();
        this.fullRefresh = true;
        this.updateData();
    }

    handleSubmit(record) {
        this.props.crudUpdate(this.props.resource, this.props.id, record, this.props.data, this.getBasePath());
    }

    render() {
        const { actions = <DefaultActions />, children, data, hasDelete, hasShow, id, isLoading, resource, title, translate } = this.props;
        const { key } = this.state;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('aor.page.edit', {
            name: `${resourceName}`,
            id,
            data,
        });
        const titleElement = data ? <Title title={title} record={data} defaultTitle={defaultTitle} /> : '';
        // using this.previousKey instead of this.fullRefresh makes
        // the new form mount, the old form unmount, and the new form update appear in the same frame
        // so the form doesn't disappear while refreshing
        const isRefreshing = key !== this.previousKey;
        this.previousKey = key;

        return (
            <div className="edit-page">
                <Card style={{ opacity: isLoading ? 0.8 : 1 }} key={key}>
                    {actions && React.cloneElement(actions, {
                        basePath,
                        data,
                        hasDelete,
                        hasShow,
                        refresh: this.refresh,
                        resource,
                    })}
                    <ViewTitle title={titleElement} />
                    {data && !isRefreshing && React.cloneElement(children, {
                        onSubmit: this.handleSubmit,
                        resource,
                        basePath,
                        record: data,
                        translate,
                    })}
                    {!data && <CardText>&nbsp;</CardText>}
                </Card>
            </div>
        );
    }
}

Edit.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    crudUpdate: PropTypes.func.isRequired,
    data: PropTypes.object,
    hasDelete: PropTypes.bool,
    hasShow: PropTypes.bool,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func,
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        data: state.admin[props.resource].data[decodeURIComponent(props.match.params.id)],
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(
        mapStateToProps,
        { crudGetOne: crudGetOneAction, crudUpdate: crudUpdateAction },
    ),
    translate,
);

export default enhance(Edit);
