import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import translate from '../i18n/translate';
import { crudGetOne, crudDelete } from '../actions';

/**
 * Page component for the Delete view
 * 
 * Can be used either directly inside a `<Resource>`, or to define
 * a custom Delete view.
 *
 * Here are all the props accepted by the `<Delete>`component:
 *
 * - title
 * - actions
 * 
 * Both expect an element for value.
 * 
 * @example
 *     import { Admin, Resource, Delete } from 'react-admin';
 *     import { PostList } from '../posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" list={PostList} remove={Delete} />
 *         </Admin>
 *     );
 *
 * @example
 *     import PostDeleteActions from './DeleteActions';
 *     const PostDeleteTitle = ({ record }) => (
 *         <span>
 *             {record ? `Delete post ${record.title}` : ''}
 *         </span>
 *     ));
 *     const PostDelete = (props) =>
 *         <Delete
 *             title={<PostDeleteTitle />}
 *             actions={<PostDeleteActions />}
 *         />;
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" list={PostList} remove={PostDelete} />
 *         </Admin>
 *     );
 */
export class DeleteController extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        this.props.crudGetOne(
            this.props.resource,
            this.props.id,
            this.getBasePath()
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(
                nextProps.resource,
                nextProps.id,
                this.getBasePath()
            );
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname
            .split('/')
            .slice(0, -2)
            .join('/');
    }

    defaultRedirectRoute() {
        return 'list';
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudDelete(
            this.props.resource,
            this.props.id,
            this.props.record,
            this.getBasePath(),
            this.props.redirect
                ? this.props.redirect
                : this.defaultRedirectRoute()
        );
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        const {
            children,
            id,
            record,
            isLoading,
            resource,
            translate,
        } = this.props;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.delete', {
            name: `${resourceName}`,
            id,
            data: record,
        });

        return children({
            basePath,
            defaultTitle,
            goBack: this.goBack,
            handleSubmit: this.handleSubmit,
            isLoading,
            record,
            translate,
        });
    }
}

DeleteController.propTypes = {
    children: PropTypes.func.isRequired,
    crudDelete: PropTypes.func.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    record: PropTypes.object,
    hasCreate: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    history: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    redirect: PropTypes.string,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        record:
            state.admin.resources[props.resource].data[
                decodeURIComponent(props.match.params.id)
            ],
        isLoading: state.admin.loading > 0,
    };
}

export default compose(
    connect(mapStateToProps, { crudGetOne, crudDelete }),
    translate
)(DeleteController);
