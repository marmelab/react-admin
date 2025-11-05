import * as React from 'react';
import { CreateBase, CreateBaseProps, Identifier, RaRecord } from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

import { CreateView, CreateViewProps } from './CreateView';
import { Loading } from '../layout';

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
 * - children: Component rendering the Form Layout
 * - render: Alternative to children. A function to render the Form Layout. Receives the create context as its argument.
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
 * export const PostCreate = () => (
 *     <Create>
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
export const Create = <
    RecordType extends Omit<RaRecord, 'id'> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
>(
    inProps: CreateProps<RecordType, Error, ResultRecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        resource,
        record,
        redirect,
        transform,
        mutationMode,
        mutationOptions,
        disableAuthentication,
        hasEdit,
        hasShow,
        loading,
        authLoading = loading ?? defaultAuthLoading,
        ...rest
    } = props;

    if (!props.render && !props.children) {
        throw new Error(
            '<Create> requires either a `render` prop or `children` prop'
        );
    }

    return (
        <CreateBase<RecordType, ResultRecordType>
            resource={resource}
            record={record}
            redirect={redirect}
            transform={transform}
            mutationMode={mutationMode}
            mutationOptions={mutationOptions}
            disableAuthentication={disableAuthentication}
            hasEdit={hasEdit}
            hasShow={hasShow}
            authLoading={authLoading}
        >
            <CreateView {...rest} />
        </CreateBase>
    );
};

export interface CreateProps<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = Error,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
> extends Omit<
            CreateBaseProps<RecordType, ResultRecordType, MutationOptionsError>,
            'children' | 'render'
        >,
        CreateViewProps {}

const defaultAuthLoading = <Loading />;

const PREFIX = 'RaCreate'; // Types declared in CreateView.
