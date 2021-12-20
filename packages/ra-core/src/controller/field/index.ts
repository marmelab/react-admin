import ReferenceArrayFieldController, {
    ReferenceArrayFieldControllerProps,
} from './ReferenceArrayFieldController';
import ReferenceFieldController, {
    ReferenceFieldControllerProps,
} from './ReferenceFieldController';
import getResourceLinkPath, { LinkToType } from './getResourceLinkPath';
import useReferenceArrayFieldController from './useReferenceArrayFieldController';
import useReferenceManyFieldController from './useReferenceManyFieldController';
import { ListControllerProps } from '../list';

// kept for backwards compatibility
// deprecated to be removed in 4.0
export type ReferenceArrayProps = ListControllerProps;
export type ReferenceManyProps = ListControllerProps;

export type {
    LinkToType,
    ReferenceArrayFieldControllerProps,
    ReferenceFieldControllerProps,
};

export {
    useReferenceArrayFieldController,
    ReferenceArrayFieldController,
    ReferenceFieldController,
    getResourceLinkPath,
    useReferenceManyFieldController,
};

export * from './useReferenceManyFieldController';
