import { ReactNode, useCallback } from 'react';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import inflection from 'inflection';
import { parse } from 'query-string';

import { crudCreate } from '../actions';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { Record, Translate, ReduxState } from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import { useTranslate } from '../i18n';

interface ChildrenFuncParams {
    isLoading: boolean;
    defaultTitle: string;
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
    record?: Partial<Record>;
    resource: string;
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
const CreateController = (props: Props) => {
    useCheckMinimumRequiredProps(
        'Create',
        ['basePath', 'location', 'resource'],
        props
    );
    const {
        basePath,
        children,
        resource,
        location,
        record = {},
        hasShow,
        hasEdit,
    } = props;

    const translate = useTranslate();
    const dispatch = useDispatch();
    const recordToUse = getRecord(location, record);
    const isLoading = useSelector(
        (state: ReduxState) => state.admin.loading > 0
    );

    const save = useCallback(
        (data: Partial<Record>, redirect: RedirectionSideEffect) => {
            dispatch(crudCreate(resource, data, basePath, redirect));
        },
        [resource, basePath]
    );

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
        save,
        resource,
        basePath,
        record: recordToUse,
        redirect: getDefaultRedirectRoute(hasShow, hasEdit),
        translate,
    });
};

export default CreateController;

export const getRecord = ({ state, search }, record: any = {}) =>
    state && state.record
        ? state.record
        : search
        ? parse(search, { arrayFormat: 'bracket' })
        : record;

const getDefaultRedirectRoute = (hasShow, hasEdit) => {
    if (hasEdit) {
        return 'edit';
    }
    if (hasShow) {
        return 'show';
    }
    return 'list';
};
