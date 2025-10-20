import * as React from 'react';

import { RaRecord } from '../../types';
import {
    useShowController,
    ShowControllerProps,
    ShowControllerResult,
} from './useShowController';
import { ShowContextProvider } from './ShowContextProvider';
import { OptionalResourceContextProvider } from '../../core';
import { useIsAuthPending } from '../../auth';
import { ReactNode } from 'react';

/**
 * Call useShowController and put the value in a ShowContext
 *
 * Base class for <Show> components, without UI.
 *
 * Accepts any props accepted by useShowController:
 * - id: The record identifier
 * - resource: The resource
 *
 * @example // Custom show layout
 *
 * const PostShow = () => (
 *     <ShowBase resource="posts">
 *         <Grid container>
 *             <Grid item xs={8}>
 *                 <SimpleForm>
 *                     ...
 *                 </SimpleForm>
 *             </Grid>
 *             <Grid item xs={4}>
 *                 Show instructions...
 *             </Grid>
 *         </Grid>
 *         <div>
 *             Post related links...
 *         </div>
 *     </ShowBase>
 * );
 */
export const ShowBase = <RecordType extends RaRecord = any>({
    authLoading,
    loading,
    offline,
    error,
    redirectOnError,
    children,
    render,
    ...props
}: ShowBaseProps<RecordType>) => {
    const hasError = error !== false && error !== undefined;
    const controllerProps = useShowController<RecordType>({
        ...props,
        redirectOnError: redirectOnError ?? (hasError ? false : undefined),
    });

    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'show',
    });

    if (!render && !children) {
        throw new Error(
            '<ShowBase> requires either a `render` prop or `children` prop'
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
            <ShowContextProvider value={controllerProps}>
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
            </ShowContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface ShowBaseProps<RecordType extends RaRecord = RaRecord>
    extends ShowControllerProps<RecordType> {
    authLoading?: ReactNode;
    loading?: ReactNode;
    offline?: ReactNode;
    error?: ReactNode;
    children?: React.ReactNode;
    render?: (props: ShowControllerResult<RecordType>) => React.ReactNode;
}
