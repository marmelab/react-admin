import * as React from 'react';
import { EditBase, RaRecord, EditBaseProps } from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

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
 * - children: Component rendering  the Form Layout
 * - render: Alternative to children. A function to render the Form Layout. Receives the edit context as its argument.
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
    inProps: EditProps<RecordType, Error>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        resource,
        id,
        mutationMode,
        mutationOptions,
        queryOptions,
        redirect,
        transform,
        disableAuthentication,
        authLoading = defaultAuthLoading,
        loading,
        error,
        redirectOnError,
        ...rest
    } = props;

    if (!props.render && !props.children) {
        throw new Error(
            '<Edit> requires either a `render` prop or `children` prop'
        );
    }

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
            authLoading={authLoading}
            loading={loading}
            // Disable redirect on error as it is handled by EditView to display the error in the EditView container
            redirectOnError={redirectOnError ?? (error ? false : undefined)}
            // Disable offline support from EditBase as it is handled by EditView to keep the EditView container
            offline={false}
        >
            <EditView error={error} {...rest} />
        </EditBase>
    );
};

export interface EditProps<RecordType extends RaRecord = any, ErrorType = Error>
    extends EditBaseProps<RecordType, ErrorType>,
        Omit<EditViewProps, 'children' | 'render'> {}

const defaultAuthLoading = <Loading />;

const PREFIX = 'RaEdit'; // Types declared in EditView.
