import { ReactNode } from 'react';
import { RaRecord } from '../../types';
import {
    useShowController,
    ShowControllerProps,
    ShowControllerResult,
} from './useShowController';

/**
 * Render prop version of the useShowController hook
 *
 * @see useShowController
 * @example
 *
 * const ShowView = () => <div>...</div>
 * const MyShow = () => (
 *     <ShowController>
 *         {controllerProps => <ShowView {...controllerProps} {...props} />}
 *     </ShowController>
 * );
 */
export const ShowController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>({
    children,
    ...props
}: {
    children: (
        params: ShowControllerResult<RecordType, ErrorType>
    ) => ReactNode;
} & ShowControllerProps<RecordType, ErrorType>) => {
    const controllerProps = useShowController<RecordType, ErrorType>(props);
    return children(controllerProps);
};
