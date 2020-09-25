import { ReactElement, FunctionComponent } from 'react';

import { Record, SortPayload } from '../../types';
import useReferenceManyFieldController from './useReferenceManyFieldController';
import { ListControllerProps } from '../useListController';

interface Props {
    basePath: string;
    children: (params: ListControllerProps) => ReactElement<any>;
    filter?: any;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source: string;
    target: string;
    total?: number;
}

/**
 * Render prop version of the useReferenceManyFieldController hook.
 *
 * @see useReferenceManyFieldController
 */
export const ReferenceManyFieldController: FunctionComponent<Props> = props => {
    const { children, page = 1, perPage = 25, ...rest } = props;
    const controllerProps = useReferenceManyFieldController({
        page,
        perPage,
        ...rest,
    });
    return children(controllerProps);
};

export default ReferenceManyFieldController;
