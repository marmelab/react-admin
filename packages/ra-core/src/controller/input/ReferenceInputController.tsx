import { ReactNode, ComponentType, ReactElement } from 'react';

import { SortPayload, Record } from '../../types';
import {
    useReferenceInputController,
    ReferenceInputValue,
} from './useReferenceInputController';

export interface ReferenceInputControllerProps {
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
    enableGetChoices?: (filters: any) => boolean;
}

/**
 * Render prop version of the useReferenceInputController hook.
 *
 * @see useReferenceInputController
 */
export const ReferenceInputController = (
    props: ReferenceInputControllerProps
) => {
    const { children, ...rest } = props;
    return children(useReferenceInputController(rest)) as ReactElement;
};

export default ReferenceInputController as ComponentType<
    ReferenceInputControllerProps
>;
