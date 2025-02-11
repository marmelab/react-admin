import { ReactNode } from 'react';
import {
    useEditController,
    EditControllerProps,
    EditControllerResult,
} from './useEditController';
import { RaRecord } from '../../types';

/**
 * Render prop version of the useEditController hook
 *
 * @see useEditController
 * @example
 *
 * const EditView = () => <div>...</div>
 * const MyEdit = props => (
 *     <EditController {...props}>
 *         {controllerProps => <EditView {...controllerProps} {...props} />}
 *     </EditController>
 * );
 */
export const EditController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>({
    children,
    ...props
}: {
    children: (
        params: EditControllerResult<RecordType, ErrorType>
    ) => ReactNode;
} & EditControllerProps<RecordType, ErrorType>) => {
    const controllerProps = useEditController<RecordType, ErrorType>(props);
    return children(controllerProps);
};
