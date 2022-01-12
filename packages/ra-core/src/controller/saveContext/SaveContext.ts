import { createContext } from 'react';
import { Record, OnFailure, OnSuccess, TransformData } from '../../types';

export interface SaveContextValue {
    save?: SaveHandler;
    saving?: boolean;
}

export type SaveHandler = (
    record: Partial<Record>,
    callbacks?: {
        onSuccess?: OnSuccess;
        onFailure?: OnFailure;
        transform?: TransformData;
    }
) => void;

export const SaveContext = createContext<SaveContextValue>(undefined);
