import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    CreateContextProvider,
    RaRecord,
    ResourceContextProvider,
    useCheckMinimumRequiredProps,
    useCreateController,
} from 'ra-core';

import { CreateProps } from '../types';
import { CreateView } from './CreateView';

/**
 * Page component for the Create view
 *
 * The `<Create>` component renders the page title and actions.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes the `record` as prop.
 *
 * The <Create> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - mutationOptions
 * - title
 *
 * @example
 *
 * // in src/posts.js
 * import * as React from "react";
 * import { Create, SimpleForm, TextInput } from 'react-admin';
 *
 * export const PostCreate = (props) => (
 *     <Create {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostCreate } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" create={PostCreate} />
 *     </Admin>
 * );
 * export default App;
 */
export const Create = <RecordType extends RaRecord = any>(
    props: CreateProps<RecordType> & { children: ReactElement }
): ReactElement => {
    useCheckMinimumRequiredProps('Create', ['children'], props);
    const controllerProps = useCreateController<RecordType>(props);
    const body = (
        <CreateContextProvider value={controllerProps}>
            <CreateView {...props} {...controllerProps} />
        </CreateContextProvider>
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

Create.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    title: PropTypes.node,
    record: PropTypes.object,
    hasList: PropTypes.bool,
    mutationOptions: PropTypes.object,
    transform: PropTypes.func,
};
