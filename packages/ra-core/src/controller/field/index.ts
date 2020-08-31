import ReferenceArrayFieldController from './ReferenceArrayFieldController';
import ReferenceFieldController from './ReferenceFieldController';
import ReferenceManyFieldController from './ReferenceManyFieldController';
import getResourceLinkPath, { LinkToType } from './getResourceLinkPath';
import useReferenceArrayFieldController from './useReferenceArrayFieldController';
import useReferenceManyFieldController from './useReferenceManyFieldController';
import { ListControllerProps } from '../useListController';

// kept for backwards compatibility
// deprecated to be removed in 4.0
export type ReferenceArrayProps = ListControllerProps;
export type ReferenceManyProps = ListControllerProps;

export type { LinkToType };

export {
    useReferenceArrayFieldController,
    ReferenceArrayFieldController,
    ReferenceFieldController,
    getResourceLinkPath,
    useReferenceManyFieldController,
    ReferenceManyFieldController,
};
