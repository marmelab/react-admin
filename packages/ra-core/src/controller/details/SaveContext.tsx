import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
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
export const useSaveContext = <
    PropsType extends SaveContextValue = SaveContextValue
>(
    props?: PropsType
) => {
    const context = useContext(SaveContext);

    if (!context.save) {
        /**
         * The element isn't inside a <SaveContextProvider>
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "Edit or Create child components must be used inside a <SaveContextProvider>. Relying on props rather than context to get persistance related data and callbacks is deprecated and won't be supported in the next major version of react-admin."
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
            ]),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            context.save,
            context.saving,
            context.setOnFailure,
            context.setOnSuccess,
            context.setTransform,
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return value;
};
