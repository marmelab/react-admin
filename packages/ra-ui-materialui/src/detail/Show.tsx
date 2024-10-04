import * as React from 'react';
import { ReactElement } from 'react';
import { ShowBase, RaRecord, ShowBaseProps } from 'ra-core';
import { ShowView, ShowViewProps } from './ShowView';
import { Loading } from '../layout';

/**
 * Page component for the Show view
 *
 * The `<Show>` component handles the headless logic of the Show page:
 * - it calls useShowController to fetch the record from the data provider,
 * - it creates a ShowContext and a RecordContext,
 * - it computes the default page title
 * - it renders the page layout with the correct title and actions
 *
 * `<Show>` is not responsible for rendering the actual page -
 * that's the job of its child component (usually `<SimpleShowLayout>`).
 *
 * @example
 *
 * // in src/posts.js
 * import * as React from "react";
 * import { Show, SimpleShowLayout, TextField } from 'react-admin';
 *
 * export const PostShow = () => (
 *     <Show>
 *         <SimpleShowLayout>
 *             <TextField source="title" />
 *         </SimpleShowLayout>
 *     </Show>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostShow } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" show={PostShow} />
 *     </Admin>
 * );
 * export default App;
 *
 * @param {ShowProps} props
 * @param {ReactElement|false} props.actions An element to display above the page content, or false to disable actions.
 * @param {string} props.className A className to apply to the page content.
 * @param {ElementType} props.component The component to use as root component (div by default).
 * @param {boolean} props.emptyWhileLoading Do not display the page content while loading the initial data.
 * @param {string} props.id The id of the resource to display (grabbed from the route params if not defined).
 * @param {Object} props.queryClient Options to pass to the react-query useQuery hook.
 * @param {string} props.resource The resource to fetch from the data provider (grabbed from the ResourceContext if not defined).
 * @param {Object} props.sx Custom style object.
 * @param {ElementType|string} props.title The title of the page. Defaults to `#{resource} #${id}`.
 *
 * @see ShowView for the actual rendering
 */
export const Show = <RecordType extends RaRecord = any>({
    id,
    resource,
    queryOptions,
    disableAuthentication,
    loading = defaultLoading,
    ...rest
}: ShowProps<RecordType>): ReactElement => (
    <ShowBase<RecordType>
        id={id}
        disableAuthentication={disableAuthentication}
        queryOptions={queryOptions}
        resource={resource}
        loading={loading}
    >
        <ShowView {...rest} />
    </ShowBase>
);

export interface ShowProps<RecordType extends RaRecord = any>
    extends ShowBaseProps<RecordType>,
        Omit<ShowViewProps, 'children'> {}

const defaultLoading = <Loading />;
