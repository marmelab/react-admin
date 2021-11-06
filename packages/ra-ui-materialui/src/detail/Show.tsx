import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
    ShowContextProvider,
    ResourceContextProvider,
    useCheckMinimumRequiredProps,
    useShowController,
} from 'ra-core';

import { ShowProps } from '../types';
import { ShowView } from './ShowView';

/**
 * Page component for the Show view
 *
 * The `<Show>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleShowLayout>`),
 * to which it passes the `record` as prop.
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
export const Show = (props: ShowProps): ReactElement => {
    useCheckMinimumRequiredProps('Show', ['children'], props);
    const controllerProps = useShowController(props);
    const body = (
        <ShowContextProvider value={controllerProps}>
            <ShowView {...props} />
        </ShowContextProvider>
    );
    return props.resource ? (
        // support resource override via props
        <ResourceContextProvider value={props.resource}>
            {body}
        </ResourceContextProvider>
    ) : (
        body
    );
};

Show.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.elementType,
    resource: PropTypes.string,
    title: PropTypes.node,
};
