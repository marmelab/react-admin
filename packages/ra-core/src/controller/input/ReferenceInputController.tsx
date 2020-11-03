import {
    ReactNode,
    ComponentType,
    FunctionComponent,
    ReactElement,
} from 'react';

import { SortPayload, Record } from '../../types';
import {
    useReferenceInputController,
    ReferenceInputValue,
} from './useReferenceInputController';

interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: ReferenceInputValue) => ReactNode;
    filter?: any;
    filterToQuery?: (filter: string) => any;
    input?: any;
    perPage?: number;
    record?: Record;
    reference: string;
    referenceSource?: (resource: string, source: string) => string;
    resource: string;
    sort?: SortPayload;
    source: string;
    onChange: () => void;
}

/**
 * Render prop version of the useReferenceInputController hook.
 *
 * @see useReferenceInputController
 */
export const ReferenceInputController: FunctionComponent<Props> = ({
    children,
    ...props
}) => {
    return children(useReferenceInputController(props)) as ReactElement;
};

export default ReferenceInputController as ComponentType<Props>;
