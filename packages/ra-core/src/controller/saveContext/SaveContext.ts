import { createContext } from 'react';
import { RaRecord, onError, OnSuccess, TransformData } from '../../types';

export interface SaveContextValue {
    save?: SaveHandler;
    saving?: boolean;
}

export type SaveHandler = (
    record: Partial<RaRecord>,
    callbacks?: {
        onSuccess?: OnSuccess;
        onError?: onError;
        transform?: TransformData;
    }
) => void | Record<string, string>;

export const SaveContext = createContext<SaveContextValue>(undefined);
