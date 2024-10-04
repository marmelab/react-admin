import * as React from 'react';
import { ReactNode } from 'react';

import { RaRecord } from '../../types';
import { useEditController, EditControllerProps } from './useEditController';
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
    children,
    loading = null,
    ...props
}: EditBaseProps<RecordType, ErrorType>) => {
    const controllerProps = useEditController<RecordType, ErrorType>(props);

    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'edit',
    });

    if (isAuthPending && !props.disableAuthentication) {
        return loading;
    }

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <EditContextProvider value={controllerProps}>
                {children}
            </EditContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface EditBaseProps<
    RecordType extends RaRecord = RaRecord,
    ErrorType = Error,
> extends EditControllerProps<RecordType, ErrorType> {
    children: ReactNode;
    loading?: ReactNode;
}
