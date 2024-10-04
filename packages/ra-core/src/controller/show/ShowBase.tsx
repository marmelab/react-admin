import * as React from 'react';

import { RaRecord } from '../../types';
import { useShowController, ShowControllerProps } from './useShowController';
import { ShowContextProvider } from './ShowContextProvider';
import { OptionalResourceContextProvider } from '../../core';
import { useIsAuthPending } from '../../auth';

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
    children,
    loading = null,
    ...props
}: ShowBaseProps<RecordType>) => {
    const controllerProps = useShowController<RecordType>(props);

    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'show',
    });

    if (isAuthPending && !props.disableAuthentication) {
        return loading;
    }

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <ShowContextProvider value={controllerProps}>
                {children}
            </ShowContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface ShowBaseProps<RecordType extends RaRecord = RaRecord>
    extends ShowControllerProps<RecordType> {
    children: React.ReactNode;
    loading?: React.ReactNode;
}
