import { ReactNode } from 'react';
import { RaRecord } from '../../types';
import {
    useListController,
    ListControllerProps,
    ListControllerResult,
} from './useListController';

/**
 * Render prop version of the useListController hook.
 *
 * @see useListController
 * @example
 *
 * const ListView = () => <div>...</div>;
 * const List = props => (
 *     <ListController {...props}>
 *        {controllerProps => <ListView {...controllerProps} {...props} />}
 *     </ListController>
 * )
 */
export const ListController = <
    RecordType extends RaRecord = any,
    ErrorType = Error,
>({
    children,
    ...props
}: {
    children: (
        params: ListControllerResult<RecordType, ErrorType>
    ) => ReactNode;
} & ListControllerProps<RecordType, ErrorType>) => {
    const controllerProps = useListController<RecordType, ErrorType>(props);
    return children(controllerProps);
};
