import { ReactNode } from 'react';
import {
    useCreateController,
    CreateControllerProps,
    CreateControllerResult,
} from './useCreateController';
import { RaRecord } from '../../types';

/**
 * Render prop version of the useCreateController hook
 *
 * @see useCreateController
 * @example
 *
 * const CreateView = () => <div>...</div>
 * const MyCreate = props => (
 *     <CreateController {...props}>
 *         {controllerProps => <CreateView {...controllerProps} {...props} />}
 *     </CreateController>
 * );
 */
export const CreateController = <
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = Error,
>({
    children,
    ...props
}: {
    children: (params: CreateControllerResult<RecordType>) => ReactNode;
} & CreateControllerProps<RecordType, MutationOptionsError>) => {
    const controllerProps = useCreateController<
        RecordType,
        MutationOptionsError
    >(props);
    return children(controllerProps);
};
