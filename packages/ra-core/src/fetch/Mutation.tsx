import { FunctionComponent, ReactElement } from 'react';
import useMutation from './useMutation';

type DataProviderCallback = (
    type: string,
    resource: string,
    payload?: any,
    options?: any
) => Promise<any>;

interface ChildrenFuncParams {
    data?: any;
    loading: boolean;
    error?: any;
}

interface Props {
    children: (
        mutate: () => void,
        params: ChildrenFuncParams
    ) => ReactElement<any, any>;
    type: string;
    resource: string;
    payload?: any;
    options?: any;
}

/**
 * Craft a callback to fetch the data provider and pass it to a child function
 *
 * @example
 *
 * const ApproveButton = ({ record }) => (
 *     <Mutation
 *         type="UPDATE"
 *         resource="comments"
 *         payload={{ id: record.id, data: { isApproved: true } }}
 *     >
 *         {(approve) => (
 *             <FlatButton label="Approve" onClick={approve} />
 *         )}
 *     </Mutation>
 * );
 */
const Mutation: FunctionComponent<Props> = ({
    children,
    type,
    resource,
    payload,
    options,
}) => children(...useMutation({ type, resource, payload }, options));

export default Mutation;
