import { ReactElement, FunctionComponent } from 'react';

import { Record, Sort } from '../../types';
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
    sort?: Sort;
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
    const { children, ...rest } = props;
    const controllerProps = useReferenceManyFieldController(rest);
    return children(controllerProps);
};

export default ReferenceManyFieldController;
