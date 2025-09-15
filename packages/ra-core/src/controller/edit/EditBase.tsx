import * as React from 'react';
import { ReactNode } from 'react';

import { RaRecord } from '../../types';
import {
    useEditController,
    EditControllerProps,
    EditControllerResult,
} from './useEditController';
import { EditContextProvider } from './EditContextProvider';
import { OptionalResourceContextProvider } from '../../core';
import { useIsAuthPending } from '../../auth';

/**
 * Call useEditController and put the value in a EditContext
 *
 * Base class for <Edit> components, without UI.
 *
 * Accepts any props accepted by useEditController:
 * - id: The record identifier
 * - resource: The resource
 *
 * @example // Custom edit layout
 *
 * const PostEdit = () => (
 *     <EditBase resource="posts">
 *         <Grid container>
 *             <Grid item xs={8}>
 *                 <SimpleForm>
 *                     ...
 *                 </SimpleForm>
 *             </Grid>
 *             <Grid item xs={4}>
 *                 Edit instructions...
 *             </Grid>
 *         </Grid>
 *         <div>
 *             Post related links...
 *         </div>
 *     </EditBase>
 * );
 */
export const EditBase = <RecordType extends RaRecord = any, ErrorType = Error>({
    authLoading,
    loading,
    offline,
    error,
    redirectOnError,
    children,
    render,
    ...props
}: EditBaseProps<RecordType, ErrorType>) => {
    const hasError = error !== false && error !== undefined;
    const controllerProps = useEditController<RecordType, ErrorType>({
        ...props,
        redirectOnError: redirectOnError ?? (hasError ? false : undefined),
    });

    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'edit',
    });

    if (!render && !children) {
        throw new Error(
            "<EditBase> requires either a 'render' prop or 'children' prop"
        );
    }

    const { isPaused, isPending, error: errorState } = controllerProps;

    const showAuthLoading =
        isAuthPending &&
        !props.disableAuthentication &&
        authLoading !== false &&
        authLoading !== undefined;

    const showLoading =
        !isPaused &&
        ((!props.disableAuthentication && isAuthPending) || isPending) &&
        loading !== false &&
        loading !== undefined;

    const showOffline =
        isPaused && isPending && offline !== false && offline !== undefined;

    const showError = errorState && hasError;

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <EditContextProvider value={controllerProps}>
                {showAuthLoading
                    ? authLoading
                    : showLoading
                      ? loading
                      : showOffline
                        ? offline
                        : showError
                          ? error
                          : render
                            ? render(controllerProps)
                            : children}
            </EditContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface EditBaseProps<
    RecordType extends RaRecord = RaRecord,
    ErrorType = Error,
> extends EditControllerProps<RecordType, ErrorType> {
    authLoading?: ReactNode;
    loading?: ReactNode;
    offline?: ReactNode;
    error?: ReactNode;
    children?: ReactNode;
    render?: (props: EditControllerResult<RecordType, ErrorType>) => ReactNode;
}
