import { createContext } from 'react';
import {
    RaRecord,
    OnError,
    OnSuccess,
    TransformData,
    MutationMode,
} from '../../types';
import { Middleware } from './useMutationMiddlewares';
import { UseMutationOptions } from '@tanstack/react-query';

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

export type SaveHandler<RecordType, ErrorType = Error> = (
    record: Partial<RecordType>,
    callbacks?: SaveHandlerCallbacks<RecordType, ErrorType>
) => Promise<void | RecordType> | Record<string, string>;

export type SaveHandlerCallbacks<
    RecordType = any,
    ErrorType = Error,
    TVariables = any,
> = Omit<
    UseMutationOptions<RecordType, ErrorType, TVariables>,
    'mutationFn'
> & {
    onSuccess?: OnSuccess;
    onError?: OnError;
    transform?: TransformData;
    meta?: any;
    disableCacheUpdate?: boolean;
};
export const SaveContext = createContext<SaveContextValue>({});
