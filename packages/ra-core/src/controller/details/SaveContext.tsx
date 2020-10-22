import * as React from 'react';
import { createContext, useContext } from 'react';
import pick from 'lodash/pick';

import { RedirectionSideEffect } from '../../sideEffect';
import { Record } from '../../types';
import {
    OnFailure,
    OnSuccess,
    SideEffectContextValue,
    TransformData,
} from '../saveModifiers';

interface SaveContextValue extends SideEffectContextValue {
    save: (
        record: Partial<Record>,
        redirect: RedirectionSideEffect,
        callbacks?: {
            onSuccess?: OnSuccess;
            onFailure?: OnFailure;
            transform?: TransformData;
        }
    ) => void;
    saving: boolean;
}

export const SaveContext = createContext<SaveContextValue>({
    save: null,
    saving: null,
});

export const SaveContextProvider = ({ children, value }) => (
    <SaveContext.Provider value={value}>{children}</SaveContext.Provider>
);

/**
 * Get the save() function and its status
 *
 * Used in forms.
 *
 * @example
 *
 * const {
 *     save,
 *     saving
 * } = useSaveContext();
 */
export const useSaveContext = () => {
    const context = useContext(SaveContext);

    if (!context) {
        console.warn(
            'useSaveContext hook must be called inside a SaveContextProvider such as provided by the CreateContextProvider or the EditContextProvider'
        );
    }

    return context;
};

export const usePickSaveContext = <
    ContextType extends SaveContextValue = SaveContextValue
>(
    context: ContextType
): SaveContextValue => {
    return pick(context, [
        'save',
        'saving',
        'setOnFailure',
        'setOnSuccess',
        'setTransform',
    ]);
};
