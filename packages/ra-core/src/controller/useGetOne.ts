import { CRUD_GET_ONE } from '../actions/dataActions/crudGetOne';
import { GET_ONE } from '../dataFetchActions';
import { Identifier, ReduxState } from '../types';
import useQueryWithStore from '../fetch/useQueryWithStore';

const useGetOne = (resource: string, id: Identifier, options: any) =>
    useQueryWithStore(
        { type: GET_ONE, resource, payload: { id } },
        { ...options, action: CRUD_GET_ONE },
        (state: ReduxState) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].data[id]
                : null
    );

export default useGetOne;
