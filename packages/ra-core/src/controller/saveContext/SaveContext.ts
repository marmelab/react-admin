import { createContext } from 'react';
import {
    RaRecord,
    onError,
    OnSuccess,
    TransformData,
    MutationMode,
} from '../../types';
import { Middleware } from './useMutationMiddlewares';

export interface SaveContextValue<
    RecordType extends RaRecord = any,
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any
> {
    save?: SaveHandler<RecordType>;
    saving?: boolean;
    mutationMode?: MutationMode;
    addMiddleware?: (callback: Middleware<MutateFunc>) => void;
    removeMiddleware?: (callback: Middleware<MutateFunc>) => void;
}

export type SaveHandler<RecordType> = (
    record: Partial<RecordType>,
    callbacks?: {
        onSuccess?: OnSuccess;
        onError?: onError;
        transform?: TransformData;
    }
) => Promise<void | RecordType> | Record<string, string>;

export const SaveContext = createContext<SaveContextValue>(undefined);
