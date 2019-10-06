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
 * Get a callback to call the data provider and pass the result to a child function
 *
 * @param {string} type The method called on the data provider, e.g. 'update', 'delete'. Can also be a custom method if the dataProvider supports is.
 * @param {string} resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} payload The payload object, e.g; { id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {boolean} options.undoable Set to true to run the mutation locally before calling the dataProvider
 * @param {Function} options.onSuccess Side effect function to be executed upon success of failure, e.g. { onSuccess: response => refresh() } }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) } }
 *
 * @example
 *
 * const ApproveButton = ({ record }) => (
 *     <Mutation
 *         type="update"
 *         resource="comments"
 *         payload={{ id: record.id, data: { isApproved: true } }}
 *     >
 *         {approve => (
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
