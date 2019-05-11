import { ReactNode, useEffect } from 'react';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import inflection from 'inflection';
import { crudGetOne } from '../actions';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Translate, Record, Identifier, ReduxState } from '../types';
import { useTranslate } from '../i18n';

interface ChildrenFuncParams {
    isLoading: boolean;
    defaultTitle: string;
    resource: string;
    basePath: string;
    record?: Record;
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
}

/**
 * Page component for the Show view
 *
 * The `<Show>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleShowLayout>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Show>` component accepts the following props:
 *
 * - title
 * - actions
 *
 * Both expect an element for value.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Show, SimpleShowLayout, TextField } from 'react-admin';
 *
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <SimpleShowLayout>
 *                 <TextField source="title" />
 *             </SimpleShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
const ShowController = (props: Props) => {
    useCheckMinimumRequiredProps('Show', ['basePath', 'resource'], props);
    const { basePath, children, id, resource } = props;
    const translate = useTranslate();
    const dispatch = useDispatch();

    const record = useSelector((state: ReduxState) =>
        state.admin.resources[props.resource]
            ? state.admin.resources[props.resource].data[props.id]
            : null
    );

    const isLoading = useSelector(
        (state: ReduxState) => state.admin.loading > 0
    );

    const version = useSelector(
        (state: ReduxState) => state.admin.ui.viewVersion
    );

    useEffect(() => {
        dispatch(crudGetOne(resource, id, basePath));
    }, [resource, id, basePath, version]);

    if (!children) {
        return null;
    }

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.show', {
        name: `${resourceName}`,
        id,
        record,
    });
    return children({
        isLoading,
        defaultTitle,
        resource,
        basePath,
        record,
        translate,
        version,
    });
};

export default ShowController;
