import { Component, ReactNode, ComponentType } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { humanize, singularize } from 'inflection';
import { parse } from 'query-string';

import withTranslate from '../i18n/translate';
import { crudCreate } from '../actions';
import checkMinimumRequiredProps from './checkMinimumRequiredProps';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { Record, Translate, Dispatch } from '../types';
import { RedirectionSideEffect } from '../sideEffect';

interface ChildrenFuncParams {
    isLoading: boolean;
    defaultTitle: string;
    onSave: (record: Partial<Record>, redirect: RedirectionSideEffect) => void;
    save: (record: Partial<Record>, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Partial<Record>;
    redirect: RedirectionSideEffect;
    translate: Translate;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    location: Location;
    match: Match;
    onSave?: (
        record: Partial<Record>,
        redirect: RedirectionSideEffect
    ) => object | void;
    record?: Partial<Record>;
    resource: string;
}

interface EnhancedProps {
    dispatch: Dispatch<any>;
    isLoading: boolean;
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
export class UnconnectedCreateController extends Component<
    Props & EnhancedProps
> {
    public static defaultProps: Partial<Props> = {
        record: {},
    };

    private record: Partial<Record>;

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

    getDefaultRedirectRoute() {
        const { hasShow, hasEdit } = this.props;
        if (hasEdit) {
            return 'edit';
        }
        if (hasShow) {
            return 'show';
        }
        return 'list';
    }

    handleSave = (record: Partial<Record>, redirect: RedirectionSideEffect) => {
        if (typeof this.props.onSave === 'function') {
            const action = this.props.onSave(record, redirect);

            if (action) {
                this.props.dispatch(action);
            }
        } else {
            this.props.dispatch(
                crudCreate(
                    this.props.resource,
                    record,
                    this.props.basePath,
                    redirect
                )
            );
        }
    };

    handleOldSave = (
        record: Partial<Record>,
        redirect: RedirectionSideEffect
    ) => {
        console.warn(
            "You're using the deprecated save function injected by CreateController. It will be removed in the next major version. Please change it to onSave"
        );
        this.handleSave(record, redirect);
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
            _: humanize(singularize(resource)),
        });
        const defaultTitle = translate('ra.page.create', {
            name: `${resourceName}`,
        });
        return children({
            isLoading,
            defaultTitle,
            onSave: this.handleSave,
            save: this.handleOldSave,
            resource,
            basePath,
            record: this.record,
            redirect: this.getDefaultRedirectRoute(),
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
    connect(mapStateToProps),
    withTranslate
)(UnconnectedCreateController);

export default CreateController as ComponentType<Props>;
