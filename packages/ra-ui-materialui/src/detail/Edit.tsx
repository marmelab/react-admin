import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    EditContextProvider,
    ResourceContextProvider,
    useCheckMinimumRequiredProps,
    useEditController,
    RaRecord,
} from 'ra-core';
import { EditProps } from '../types';
import { EditView } from './EditView';

/**
 * Page component for the Edit view
 *
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes the `record` as prop.
 *
 * The <Edit> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - title
 * - mutationMode
 * - mutationOptions
 *
 * @example
 *
 * // in src/posts.js
 * import * as React from "react";
 * import { Edit, SimpleForm, TextInput } from 'react-admin';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostEdit } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" edit={PostEdit} />
 *     </Admin>
 * );
 * export default App;
 */
export const Edit = <RaRecordType extends RaRecord = any>(
    props: EditProps<RaRecordType> & { children: ReactElement }
): ReactElement => {
    useCheckMinimumRequiredProps('Edit', ['children'], props);
    const controllerProps = useEditController<RaRecordType>(props);
    const body = (
        <EditContextProvider value={controllerProps}>
            <EditView {...props} {...controllerProps} />
        </EditContextProvider>
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

Edit.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    aside: PropTypes.element,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    id: PropTypes.any,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    mutationOptions: PropTypes.object,
    queryOptions: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    title: PropTypes.node,
    transform: PropTypes.func,
};
