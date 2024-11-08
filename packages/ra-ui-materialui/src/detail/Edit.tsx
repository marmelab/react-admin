import * as React from 'react';
import {
    EditBase,
    useCheckMinimumRequiredProps,
    RaRecord,
    EditBaseProps,
} from 'ra-core';
import { EditView, EditViewProps } from './EditView';
import { Loading } from '../layout';

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
 * export const PostEdit = () => (
 *     <Edit>
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
export const Edit = <RecordType extends RaRecord = any>(
    props: EditProps<RecordType, Error>
) => {
    useCheckMinimumRequiredProps('Edit', ['children'], props);
    const {
        resource,
        id,
        mutationMode,
        mutationOptions,
        queryOptions,
        redirect,
        transform,
        disableAuthentication,
        loading = defaultLoading,
        ...rest
    } = props;
    return (
        <EditBase<RecordType>
            resource={resource}
            id={id}
            mutationMode={mutationMode}
            mutationOptions={mutationOptions}
            queryOptions={queryOptions}
            redirect={redirect}
            transform={transform}
            disableAuthentication={disableAuthentication}
            loading={loading}
        >
            <EditView {...rest} />
        </EditBase>
    );
};

export interface EditProps<RecordType extends RaRecord = any, ErrorType = Error>
    extends EditBaseProps<RecordType, ErrorType>,
        Omit<EditViewProps, 'children'> {}

const defaultLoading = <Loading />;
