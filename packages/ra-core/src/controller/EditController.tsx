import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { reset } from 'redux-form';
import withTranslate from '../i18n/translate';
import {
    crudGetOne,
    crudUpdate,
    startUndoable as startUndoableAction,
} from '../actions';
import { REDUX_FORM_NAME } from '../form';
import checkMinimumRequiredProps from './checkMinimumRequiredProps';
import { Translate, Record, Dispatch } from '../types';
import { RedirectionSideEffect } from '../sideEffect';

interface ChildrenFuncParams {
    isLoading: boolean;
    defaultTitle: string;
    save: (data: Record, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Record;
    redirect: RedirectionSideEffect;
    translate: Translate;
    version: number;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    crudGetOne: Dispatch<typeof crudGetOne>;
    dispatchCrudUpdate: Dispatch<typeof crudUpdate>;
    record?: Record;
    hasCreate: boolean;
    hasEdit: boolean;
    hasShow: boolean;
    hasList: boolean;
    id: string;
    isLoading: boolean;
    location: object;
    match: object;
    resetForm: (form: string) => void;
    resource: string;
    startUndoable: Dispatch<typeof startUndoableAction>;
    title: string | ReactNode;
    translate: Translate;
    undoable?: boolean;
    version: number;
}

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
export class EditController extends Component<Props> {
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

        if (!children) {
            return null;
        }

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
    checkMinimumRequiredProps('Edit', ['basePath', 'resource']),
    connect(
        mapStateToProps,
        {
            crudGetOne,
            dispatchCrudUpdate: crudUpdate,
            startUndoable: startUndoableAction,
            resetForm: reset,
        }
    ),
    withTranslate
)(EditController);
