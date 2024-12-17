import { createContext } from 'react';
import { OnError, OnSuccess, TransformData, MutationMode } from '../../types';
import { Middleware } from './useMutationMiddlewares';
import { UseMutationOptions } from '@tanstack/react-query';

export interface SaveContextValue<
    RecordType = any,
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any,
    ErrorType = Error,
    ResultRecordType = RecordType,
> {
    save?: SaveHandler<RecordType, ErrorType, ResultRecordType>;
    /**
     * @deprecated. Rely on the form isSubmitting value instead
     */
    saving?: boolean;
    mutationMode?: MutationMode;
    registerMutationMiddleware?: (callback: Middleware<MutateFunc>) => void;
    unregisterMutationMiddleware?: (callback: Middleware<MutateFunc>) => void;
}

export type SaveHandler<
    RecordType,
    ErrorType = Error,
    ResultRecordType = RecordType,
> = (
    record: Partial<RecordType>,
    callbacks?: SaveHandlerCallbacks<ResultRecordType, ErrorType>
) => Promise<void | RecordType> | Record<string, string>;

export type SaveHandlerCallbacks<
    ResultRecordType = any,
    ErrorType = Error,
    TVariables = any,
> = Omit<
    UseMutationOptions<ResultRecordType, ErrorType, TVariables>,
    'mutationFn'
> & {
    onSuccess?: OnSuccess;
    onError?: OnError;
    transform?: TransformData;
    meta?: any;
    disableCacheUpdate?: boolean;
};
export const SaveContext = createContext<SaveContextValue>({});
