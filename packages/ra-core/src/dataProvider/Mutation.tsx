import { FunctionComponent } from 'react';
import useMutation from './useMutation';

interface ChildrenFuncParams {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
}

interface Props {
    children: (
        mutate: (
            event?: any,
            callTimePayload?: any,
            callTimeOptions?: any
        ) => void,
        params: ChildrenFuncParams
    ) => JSX.Element;
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
}) =>
    children(
        ...useMutation(
            { type, resource, payload },
            { ...options, withDeclarativeSideEffectsSupport: true }
        )
    );

export default Mutation;
