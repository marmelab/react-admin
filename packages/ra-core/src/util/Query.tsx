import { FunctionComponent, ReactElement } from 'react';
import useQuery from './useQuery';

interface ChildrenFuncParams {
    data?: any;
    total?: number;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

interface Props {
    children: (params: ChildrenFuncParams) => ReactElement<any, any>;
    type: string;
    resource: string;
    payload?: any;
    options?: any;
}

/**
 * Fetch the data provider and pass the result to a child function
 *
 * @example
 *
 * const UserProfile = ({ record }) => (
 *     <Query type="GET_ONE" resource="users" payload={{ id: record.id }}>
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
 *     <Query type="GET_LIST" resource="users" payload={payload}>
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
    options,
}) => children(useQuery(type, resource, payload, options));

export default Query;
