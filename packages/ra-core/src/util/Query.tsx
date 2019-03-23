import { Component, ReactNode } from 'react';
import withDataProvider from './withDataProvider';

type DataProviderCallback = (type: string, resource: string, payload?: any, options?: any) => Promise<any>;

interface ChildrenFuncParams {
    data?: any;
    total?: number;
    loading: boolean;
    error?: any;
}

interface RawProps {
    children: (params: ChildrenFuncParams) => ReactNode;
    type: string;
    resource: string;
    payload?: any;
    options?: any;
}

interface Props extends RawProps {
    dataProvider: DataProviderCallback;
}

interface State {
    data?: any;
    total?: number;
    loading: boolean;
    error?: any;
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
class Query extends Component<Props, State> {
    state = {
        data: null,
        total: null,
        loading: true,
        error: null
    };

    componentDidMount = () => {
        const { dataProvider, type, resource, payload, options } = this.props;
        dataProvider(type, resource, payload, options)
            .then(({ data, total }) => {
                this.setState({
                    data,
                    total,
                    loading: false
                });
            })
            .catch(error => {
                this.setState({
                    error,
                    loading: false
                });
            });
    };

    render() {
        const { children } = this.props;
        return children(this.state);
    }
}

export default withDataProvider<RawProps>(Query);
