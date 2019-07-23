import { FunctionComponent, ReactNode, ReactElement } from 'react';

import useReferenceArrayFieldController from './useReferenceArrayFieldController';
import { Identifier, RecordMap, Record, Sort } from '../..';

interface ChildrenFuncParams {
    loaded: boolean;
    ids: Identifier[];
    data: RecordMap;
    referenceBasePath: string;
    currentSort: Sort;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    record?: Record;
    reference: string;
    resource: string;
    source: string;
}

/**
 * Render prop version of the useReferenceArrayFieldController hook.
 *
 * @see useReferenceArrayFieldController
 */
const ReferenceArrayFieldController: FunctionComponent<Props> = ({
    resource,
    reference,
    basePath,
    record,
    source,
    children,
}) => {
    return children({
        currentSort: {
            field: 'id',
            order: 'ASC',
        },
        ...useReferenceArrayFieldController({
            resource,
            reference,
            basePath,
            record,
            source,
        }),
    }) as ReactElement<any>;
};

export default ReferenceArrayFieldController;
