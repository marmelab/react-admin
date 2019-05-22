import { ReactNode } from 'react';
import inflection from 'inflection';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Translate, Record, Identifier } from '../types';
import useGetOne from '../fetch/useGetOne';
import { useTranslate } from '../i18n';
import useVersion from './useVersion';

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
    if (!children) {
        return null;
    }
    const translate = useTranslate();
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
        isLoading: loading,
        defaultTitle,
        resource,
        basePath,
        record,
        translate,
        version,
    });
};

export default ShowController;
