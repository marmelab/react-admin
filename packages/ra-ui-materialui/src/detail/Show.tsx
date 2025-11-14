import * as React from 'react';
import { ShowBase, RaRecord, ShowBaseProps } from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

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
 * @typedef {(showContext: Object) => ReactNode} RenderProp
 * @param {ShowProps} inProps
 * @param {RenderProp} inProps.render A function rendering the page content, receive the show context as its argument.
 * @param {ReactNode|false} inProps.actions An element to display above the page content, or false to disable actions.
 * @param {string} inProps.className A className to apply to the page content.
 * @param {ElementType} inProps.component The component to use as root component (div by default).
 * @param {boolean} inProps.emptyWhileLoading Do not display the page content while loading the initial data.
 * @param {string} inProps.id The id of the resource to display (grabbed from the route params if not defined).
 * @param {Object} inProps.queryClient Options to pass to the react-query useQuery hook.
 * @param {string} inProps.resource The resource to fetch from the data provider (grabbed from the ResourceContext if not defined).
 * @param {Object} inProps.sx Custom style object.
 * @param {ElementType|string} inProps.title The title of the page. Defaults to `#{resource} #${id}`.
 *
 * @see ShowView for the actual rendering
 */
export const Show = <RecordType extends RaRecord = any>(
    inProps: ShowProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        id,
        resource,
        queryOptions,
        disableAuthentication,
        authLoading = defaultAuthLoading,
        loading,
        error,
        ...rest
    } = props;

    if (!props.render && !props.children) {
        throw new Error(
            '<Show> requires either a `render` prop or `children` prop'
        );
    }

    return (
        <ShowBase<RecordType>
            id={id}
            disableAuthentication={disableAuthentication}
            queryOptions={queryOptions}
            resource={resource}
            authLoading={authLoading}
            loading={loading}
            // Disable redirect on error as it is handled by ShowView to display the error in the ShowView container
            redirectOnError={error ? false : undefined}
            // Disable offline support from ShowBase as it is handled by ShowView to keep the ShowView container
            offline={false}
        >
            <ShowView error={error} {...rest} />
        </ShowBase>
    );
};

export interface ShowProps<RecordType extends RaRecord = any>
    extends ShowBaseProps<RecordType>,
        Omit<ShowViewProps, 'children' | 'render'> {}

const defaultAuthLoading = <Loading />;

const PREFIX = 'RaShow'; // Types declared in ShowView.
