import useMutation from './useMutation';

interface ChildrenFuncParams {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
}

export interface MutationProps {
    children: (
        mutate: (
            event?: any,
            callTimePayload?: any,
            callTimeOptions?: any
        ) => void | Promise<any>,
        params: ChildrenFuncParams
    ) => JSX.Element;
    type: string;
    resource?: string;
    payload?: any;
    options?: any;
}

/**
 * Get a callback to call the data provider and pass the result to a child function
 *
 * @param {Function} children Must be a function which will be called with the mutate callback
 * @param {string} type The method called on the data provider, e.g. 'update', 'delete'. Can also be a custom method if the dataProvider supports is.
 * @param {string} resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} payload The payload object, e.g; { id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {boolean} options.undoable Set to true to run the mutation locally before calling the dataProvider
 * @param {boolean} options.returnPromise Set to true to return the result promise of the mutation
 * @param {Function} options.onSuccess Side effect function to be executed upon success or failure, e.g. { onSuccess: response => refresh() }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
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
 *             <Button label="Approve" onClick={approve} />
 *         )}
 *     </Mutation>
 * );
 */
const Mutation = ({
    children,
    type,
    resource,
    payload,
    // Provides an undefined onSuccess just so the key `onSuccess` is defined
    // This is used to detect options in useDataProvider
    options = { onSuccess: undefined },
}: MutationProps) =>
    children(
        ...useMutation(
            { type, resource, payload },
            { ...options, withDeclarativeSideEffectsSupport: true }
        )
    );

export default Mutation;
