import ReferenceArrayInputController from './ReferenceArrayInputController';
import ReferenceInputController, {
    ReferenceInputControllerProps,
} from './ReferenceInputController';
import {
    getStatusForInput,
    getSelectedReferencesStatus,
    getStatusForArrayInput,
} from './referenceDataStatus';

export * from './useReferenceArrayInputController';
export * from './useReferenceInputController';
export * from './ReferenceArrayInputContext';
export * from './ReferenceArrayInputContextProvider';
export * from './useReferenceArrayInputContext';

export {
    getStatusForInput,
    getSelectedReferencesStatus,
    getStatusForArrayInput,
    ReferenceArrayInputController,
    ReferenceInputController,
};

export type { ReferenceInputControllerProps };
