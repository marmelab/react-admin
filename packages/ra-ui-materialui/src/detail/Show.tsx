import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { ShowBase, RaRecord } from 'ra-core';

import { ShowProps } from '../types';
import { ShowView } from './ShowView';

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
    ...rest
}: ShowProps<RecordType>): ReactElement => (
    <ShowBase<RecordType>
        id={id}
        disableAuthentication={disableAuthentication}
        queryOptions={queryOptions}
        resource={resource}
    >
        <ShowView {...rest} />
    </ShowBase>
);

Show.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disableAuthentication: PropTypes.bool,
    emptyWhileLoading: PropTypes.bool,
    component: PropTypes.elementType,
    resource: PropTypes.string,
    title: PropTypes.node,
    sx: PropTypes.any,
};
