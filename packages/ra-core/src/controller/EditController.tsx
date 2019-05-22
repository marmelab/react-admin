import { ReactNode, useEffect, useCallback } from 'react';
// @ts-ignore
import { useDispatch } from 'react-redux';
import { reset as resetForm } from 'redux-form';
import inflection from 'inflection';
import { crudUpdate, startUndoable } from '../actions';
import { REDUX_FORM_NAME } from '../form';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Translate, Record, Identifier } from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import useGetOne from './../fetch/useGetOne';
import { useTranslate } from '../i18n';
import useVersion from './useVersion';

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
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    id: Identifier;
    isLoading: boolean;
    resource: string;
    undoable?: boolean;
    record?: Record;
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
const EditController = (props: Props) => {
    useCheckMinimumRequiredProps('Edit', ['basePath', 'resource'], props);
    const { basePath, children, id, resource, undoable } = props;
    if (!children) {
        return null;
    }
    const translate = useTranslate();
    const dispatch = useDispatch();
    const version = useVersion();
    const { data: record, loading } = useGetOne(resource, id, {
        basePath,
        version, // used to force reload
        onFailure: {
            notification: {
                body: 'ra.notification.item_doesnt_exist',
                level: 'warning',
            },
            redirectTo: 'list',
            refresh: true,
        },
    });

    useEffect(() => {
        dispatch(resetForm(REDUX_FORM_NAME));
    }, [resource, id, version]);

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.edit', {
        name: `${resourceName}`,
        id,
        record,
    });

    const save = useCallback(
        (data: Partial<Record>, redirect: RedirectionSideEffect) => {
            const updateAction = crudUpdate(
                resource,
                id,
                data,
                record,
                basePath,
                redirect
            );

            if (undoable) {
                dispatch(startUndoable(updateAction));
            } else {
                dispatch(updateAction);
            }
        },
        [id, resource, basePath, record]
    );

    return children({
        isLoading: loading,
        defaultTitle,
        save,
        resource,
        basePath,
        record,
        redirect: getDefaultRedirectRoute(),
        translate,
        version,
    });
};

const getDefaultRedirectRoute = () => 'list';

export default EditController;
