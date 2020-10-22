import * as React from 'react';
import { createContext, useMemo, useRef } from 'react';
import pick from 'lodash/pick';

export const SideEffectContext = createContext<SideEffectContextValue>({});

export const SideEffectContextProvider = ({ children, value }) => (
    <SideEffectContext.Provider value={value}>
        {children}
    </SideEffectContext.Provider>
);

/**
 * Get modifiers for a save() function, and the way to update them.
 *
 * Used in useCreateController and useEditController.
 *
 * @example
 *
 * const {
 *     onSuccessRef,
 *     setOnSuccess,
 *     onFailureRef,
 *     setOnFailure,
 *     transformRef,
 *     setTransform,
 * } = useSaveModifiers({ onSuccess, onFailure, transform });
 */
export const useSaveModifiers = ({
    onSuccess,
    onFailure,
    transform,
}: SideEffectContextOptions) => {
    const onSuccessRef = useRef(onSuccess);
    const setOnSuccess: SetOnSuccess = onSuccess => {
        onSuccessRef.current = response => {
            // reset onSuccess for next submission
            onSuccessRef.current = undefined;
            return onSuccess(response);
        };
    };

    const onFailureRef = useRef(onFailure);
    const setOnFailure: SetOnFailure = onFailure => {
        onFailureRef.current = error => {
            // reset onSuccess for next submission
            onFailureRef.current = undefined;
            return onFailure(error);
        };
    };

    const transformRef = useRef(transform);
    const setTransform: SetTransformData = transform => {
        transformRef.current = data => {
            // reset transform for next submission
            transformRef.current = undefined;
            return transform(data);
        };
    };

    return {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    };
};

export const usePickSideEffectContext = <
    ContextType extends SideEffectContextValue = SideEffectContextValue
>(
    context: ContextType
) => {
    const value = useMemo(
        () => {
            const result = pick(context, [
                'setOnFailure',
                'setOnSuccess',
                'setTransform',
            ]);
            return result;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [context.setOnFailure, context.setOnSuccess, context.setTransform]
    );

    return value;
};

export type OnSuccess = (response: any) => void;
export type SetOnSuccess = (onSuccess: OnSuccess) => void;
export type OnFailure = (error: { message?: string }) => void;
export type SetOnFailure = (onFailure: OnFailure) => void;
export type TransformData = (data: any) => any | Promise<any>;
export type SetTransformData = (transform: TransformData) => void;

export interface SideEffectContextValue {
    setOnSuccess?: SetOnSuccess;
    setOnFailure?: SetOnFailure;
    setTransform?: SetTransformData;
}

export interface SideEffectContextOptions {
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
}
