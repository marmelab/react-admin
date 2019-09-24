import { FunctionComponent, useCallback } from 'react';
import merge from 'lodash/merge';

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
}) => {
    const [mutate, state] = useMutation({
        withDeclarativeSideEffectsSupport: true,
    });

    const finalMutate = useCallback(
        (event: any, callTimeData?: any, callTimeOptions?: any) =>
            mutate(
                {
                    resource,
                    payload: merge({}, payload, callTimeData),
                    type,
                },
                merge({}, options, callTimeOptions)
            ),
        [payload, mutate, resource, JSON.stringify(options)] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return children(finalMutate, state);
};

export default Mutation;
