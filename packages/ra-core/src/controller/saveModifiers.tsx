import * as React from 'react';
import { createContext, useRef } from 'react';
import { OnSuccess, OnFailure } from '../types';

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
            // reset onFailure for next submission
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

export type SetOnSuccess = (onSuccess: OnSuccess) => void;
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
