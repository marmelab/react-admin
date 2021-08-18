import { FunctionComponent } from 'react';
import { useQuery } from './useQuery';

interface ChildrenFuncParams {
    data?: any;
    total?: number;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

interface Props {
    children: (params: ChildrenFuncParams) => JSX.Element;
    type: string;
    resource?: string;
    payload?: any;
    options?: any;
}

/**
 * Fetch the data provider and pass the result to a child function
 *
 * @param {Function} children Must be a function which will be called with an object containing the following keys: data, loading and error
 * @param {string} type The method called on the data provider, e.g. 'getList', 'getOne'. Can also be a custom method if the dataProvider supports is.
 * @param {string} resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} payload The payload object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {Function} options.onSuccess Side effect function to be executed upon success or failure, e.g. { onSuccess: response => refresh() }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
 *
 * This component also supports legacy side effects (e.g. { onSuccess: { refresh: true } })
 *
 * @example
 *
 * const UserProfile = ({ record }) => (
 *     <Query type="getOne" resource="users" payload={{ id: record.id }}>
 *         {({ data, loading, error }) => {
 *             if (loading) { return <Loading />; }
 *             if (error) { return <p>ERROR</p>; }
 *             return <div>User {data.username}</div>;
 *         }}
 *     </Query>
 * );
 *
 * @example
 *
 * const payload = {
 *    pagination: { page: 1, perPage: 10 },
 *    sort: { field: 'username', order: 'ASC' },
 * };
 * const UserList = () => (
 *     <Query type="getList" resource="users" payload={payload}>
 *         {({ data, total, loading, error }) => {
 *             if (loading) { return <Loading />; }
 *             if (error) { return <p>ERROR</p>; }
 *             return (
 *                 <div>
 *                     <p>Total users: {total}</p>
 *                     <ul>
 *                         {data.map(user => <li key={user.username}>{user.username}</li>)}
 *                     </ul>
 *                 </div>
 *             );
 *         }}
 *     </Query>
 * );
 */
const Query: FunctionComponent<Props> = ({
    children,
    type,
    resource,
    payload,
    // Provides an undefined onSuccess just so the key `onSuccess` is defined
    // This is used to detect options in useDataProvider
    options = { onSuccess: undefined },
}) =>
    children(
        useQuery(
            { type, resource, payload },
            { ...options, withDeclarativeSideEffectsSupport: true }
        )
    );

export default Query;
