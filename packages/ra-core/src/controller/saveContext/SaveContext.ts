import { createContext } from 'react';
import {
    RaRecord,
    OnError,
    OnSuccess,
    TransformData,
    MutationMode,
} from '../../types';
import { Middleware } from './useMutationMiddlewares';

export interface SaveContextValue<
    RecordType extends RaRecord = any,
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any,
> {
    save?: SaveHandler<RecordType>;
    /**
     * @deprecated. Rely on the form isSubmitting value instead
     */
    saving?: boolean;
    mutationMode?: MutationMode;
    registerMutationMiddleware?: (callback: Middleware<MutateFunc>) => void;
    unregisterMutationMiddleware?: (callback: Middleware<MutateFunc>) => void;
}

export type SaveHandler<RecordType> = (
    record: Partial<RecordType>,
    callbacks?: SaveHandlerCallbacks
) => Promise<void | RecordType> | Record<string, string>;

export type SaveHandlerCallbacks = {
    onSuccess?: OnSuccess;
    onError?: OnError;
    transform?: TransformData;
    meta?: any;
};
export const SaveContext = createContext<SaveContextValue>({});
