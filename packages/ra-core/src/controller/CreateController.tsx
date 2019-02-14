import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { parse } from 'query-string';

import withTranslate from '../i18n/translate';
import { crudCreate as crudCreateAction } from '../actions';
import checkMinimumRequiredProps from './checkMinimumRequiredProps';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { Record, Translate, Dispatch } from '../types';
import { RedirectionSideEffect } from '../sideEffect';

interface ChildrenFuncParams {
    isLoading: boolean;
    defaultTitle: string;
    save: (record: Partial<Record>, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Record;
    redirect: RedirectionSideEffect;
    translate: Translate;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    crudCreate: Dispatch<typeof crudCreateAction>;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    isLoading: boolean;
    location: Location;
    match: Match;
    record?: Record;
    resource: string;
    title: string | ReactNode;
    translate: Translate;
}

/**
 * Page component for the Create view
 *
 * The `<Create>` component renders the page title and actions.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Create>` component accepts the following props:
 *
 * - title
 * - actions
 *
 * Both expect an element for value.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Create, SimpleForm, TextInput } from 'react-admin';
 *
 *     export const PostCreate = (props) => (
 *         <Create {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Create>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostCreate } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" create={PostCreate} />
 *         </Admin>
 *     );
 *     export default App;
 */
export class CreateControllerView extends Component<Props> {
    public static defaultProps = {
        record: {},
    };

    private record;

    constructor(props) {
        super(props);
        const {
            location: { state, search },
            record,
        } = this.props;
        this.record =
            state && state.record
                ? state.record
                : search
                ? parse(search, { arrayFormat: 'bracket' })
                : record;
    }

    defaultRedirectRoute() {
        const { hasShow, hasEdit } = this.props;
        if (hasEdit) {
            return 'edit';
        }
        if (hasShow) {
            return 'show';
        }
        return 'list';
    }

    save = (record: Partial<Record>, redirect: RedirectionSideEffect) => {
        this.props.crudCreate(
            this.props.resource,
            record,
            this.props.basePath,
            redirect
        );
    };

    render() {
        const {
            basePath,
            children,
            isLoading,
            resource,
            translate,
        } = this.props;

        if (!children) {
            return null;
        }

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.create', {
            name: `${resourceName}`,
        });
        return children({
            isLoading,
            defaultTitle,
            save: this.save,
            resource,
            basePath,
            record: this.record,
            redirect: this.defaultRedirectRoute(),
            translate,
        });
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

const CreateController = compose(
    checkMinimumRequiredProps('Create', ['basePath', 'location', 'resource']),
    connect(
        mapStateToProps,
        { crudCreate: crudCreateAction }
    ),
    withTranslate
)(CreateControllerView);

export default CreateController;
