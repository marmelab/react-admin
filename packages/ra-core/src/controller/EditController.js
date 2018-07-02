import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { reset } from 'redux-form';
import translate from '../i18n/translate';
import { crudGetOne, crudUpdate, startUndoable } from '../actions';
import { REDUX_FORM_NAME } from '../form';

/**
 * Page component for the Edit view
 *
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Edit>` component accepts the following props:
 *
 * - title
 * - actions
 *
 * Both expect an element for value.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Edit, SimpleForm, TextInput } from 'react-admin';
 *
 *     export const PostEdit = (props) => (
 *         <Edit {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostEdit } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" edit={PostEdit} />
 *         </Admin>
 *     );
 *     export default App;
 */
export class EditController extends Component {
    componentDidMount() {
        this.updateData();
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.id !== nextProps.id ||
            nextProps.version !== this.props.version
        ) {
            this.props.resetForm(REDUX_FORM_NAME);
            this.updateData(nextProps.resource, nextProps.id);
        }
    }

    defaultRedirectRoute() {
        return 'list';
    }

    updateData(resource = this.props.resource, id = this.props.id) {
        this.props.crudGetOne(resource, id, this.props.basePath);
    }

    save = (data, redirect) => {
        const {
            undoable = true,
            startUndoable,
            dispatchCrudUpdate,
        } = this.props;
        if (undoable) {
            startUndoable(
                crudUpdate(
                    this.props.resource,
                    this.props.id,
                    data,
                    this.props.record,
                    this.props.basePath,
                    redirect
                )
            );
        } else {
            dispatchCrudUpdate(
                this.props.resource,
                this.props.id,
                data,
                this.props.record,
                this.props.basePath,
                redirect
            );
        }
    };

    render() {
        const {
            basePath,
            children,
            id,
            isLoading,
            record,
            resource,
            translate,
            version,
        } = this.props;

        if (!children) return null;

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.edit', {
            name: `${resourceName}`,
            id,
            record,
        });

        return children({
            isLoading,
            defaultTitle,
            save: this.save,
            resource,
            basePath,
            record,
            redirect: this.defaultRedirectRoute(),
            translate,
            version,
        });
    }
}

EditController.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    dispatchCrudUpdate: PropTypes.func.isRequired,
    record: PropTypes.object,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    startUndoable: PropTypes.func.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func,
    undoable: PropTypes.bool,
    version: PropTypes.number.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: props.id,
        record: state.admin.resources[props.resource]
            ? state.admin.resources[props.resource].data[props.id]
            : null,
        isLoading: state.admin.loading > 0,
        version: state.admin.ui.viewVersion,
    };
}

export default compose(
    connect(
        mapStateToProps,
        {
            crudGetOne,
            dispatchCrudUpdate: crudUpdate,
            startUndoable,
            resetForm: reset,
        }
    ),
    translate
)(EditController);
