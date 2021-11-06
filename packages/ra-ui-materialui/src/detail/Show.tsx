import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { ShowBase, ResourceContextProvider } from 'ra-core';

import { ShowProps } from '../types';
import { ShowView } from './ShowView';

/**
 * Page component for the Show view
 *
 * The `<Show>` component handles the headless logic of the Show page:
 * - it calls useShowcontroller to fetch the record from the data provider,
 * - it creates a ShowContext and a RecordContext,
 * - it computes the default page title
 * - it renders the page layout with the correct title and actions
 *
 * `<Show>` is not responsible for rendering the actual page -
 * that's the job of its child component (usually `<SimpleShowLayout>`).
 *
 * The <Show> component accepts the following props:
 *
 * - actions
 * - className
 * - component
 * - resource
 * - title
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
 */
export const Show = ({
    id,
    resource,
    onFailure,
    ...rest
}: ShowProps): ReactElement => (
    <ResourceContextProvider value={resource}>
        <ShowBase id={id} onFailure={onFailure}>
            <ShowView {...rest} />
        </ShowBase>
    </ResourceContextProvider>
);

Show.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    component: PropTypes.elementType,
    resource: PropTypes.string,
    title: PropTypes.node,
};
