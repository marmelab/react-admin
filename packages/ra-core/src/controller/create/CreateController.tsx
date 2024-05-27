import { ReactNode } from 'react';
import {
    useCreateController,
    CreateControllerProps,
    CreateControllerResult,
} from './useCreateController';

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
export const CreateController = ({
    children,
    ...props
}: {
    children: (params: CreateControllerResult) => ReactNode;
} & CreateControllerProps) => {
    const controllerProps = useCreateController(props);
    return children(controllerProps);
};
