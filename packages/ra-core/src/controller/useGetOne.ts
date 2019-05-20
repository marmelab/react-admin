import { CRUD_GET_ONE } from '../actions/dataActions/crudGetOne';
import { GET_ONE } from '../dataFetchActions';
import { Identifier, ReduxState } from '../types';
import useQuery from '../fetch/useQuery';

const useGetOne = (resource: string, id: Identifier, options: any) =>
    useQuery(
        { type: GET_ONE, resource, payload: { id } },
        { ...options, action: CRUD_GET_ONE },
        (state: ReduxState) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].data[id]
                : null
    );

export default useGetOne;
