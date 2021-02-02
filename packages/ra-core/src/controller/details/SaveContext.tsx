import * as React from 'react';
import { createContext, MutableRefObject, useContext, useMemo } from 'react';
import pick from 'lodash/pick';

import { RedirectionSideEffect } from '../../sideEffect';
import { Record, OnFailure, OnSuccess } from '../../types';
import { SideEffectContextValue, TransformData } from '../saveModifiers';

interface SaveContextValue extends SideEffectContextValue {
    onFailureRef?: MutableRefObject<OnFailure>;
    onSuccessRef?: MutableRefObject<OnSuccess>;
    transformRef?: MutableRefObject<TransformData>;
    save?: (
        record: Partial<Record>,
        redirect: RedirectionSideEffect,
        callbacks?: {
            onSuccess?: OnSuccess;
            onFailure?: OnFailure;
            transform?: TransformData;
        }
    ) => void;
    saving?: boolean;
}

export const SaveContext = createContext<SaveContextValue>(undefined);

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
export const useSaveContext = <
    PropsType extends SaveContextValue = SaveContextValue
>(
    props?: PropsType
): SaveContextValue => {
    const context = useContext(SaveContext);

    if (!context || !context.save || !context.setOnFailure) {
        /**
         * The element isn't inside a <SaveContextProvider>
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "Edit or Create child components must be used inside a <SaveContextProvider>. Relying on props rather than context to get persistence related data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }

        return props;
    }

    return context;
};

export const usePickSaveContext = <
    ContextType extends SaveContextValue = SaveContextValue
>(
    context: ContextType
): SaveContextValue => {
    const value = useMemo(
        () =>
            pick(context, [
                'save',
                'saving',
                'setOnFailure',
                'setOnSuccess',
                'setTransform',
                'onSuccessRef',
                'onFailureRef',
                'transformRef',
            ]),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            context.save,
            context.saving,
            context.setOnFailure,
            context.setOnSuccess,
            context.setTransform,
            context.setTransform,
            context.onFailureRef,
            context.onSuccessRef,
            context.transformRef,
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return value;
};
