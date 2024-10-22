import * as React from 'react';
import { ReactNode } from 'react';
import {
    useCreateController,
    CreateControllerProps,
} from './useCreateController';
import { CreateContextProvider } from './CreateContextProvider';
import { Identifier, RaRecord } from '../../types';
import { OptionalResourceContextProvider } from '../../core';
import { useIsAuthPending } from '../../auth';

/**
 * Call useCreateController and put the value in a CreateContext
 *
 * Base class for <Create> components, without UI.
 *
 * Accepts any props accepted by useCreateController:
 * - id: The record identifier
 * - resource: The resource
 *
 * @example // Custom edit layout
 *
 * const PostCreate = () => (
 *     <CreateBase>
 *         <Grid container>
 *             <Grid item xs={8}>
 *                 <SimpleForm>
 *                     ...
 *                 </SimpleForm>
 *             </Grid>
 *             <Grid item xs={4}>
 *                 Create instructions...
 *             </Grid>
 *         </Grid>
 *         <div>
 *             Post related links...
 *         </div>
 *     </CreateBase>
 * );
 */
export const CreateBase = <
    RecordType extends Omit<RaRecord, 'id'> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
    MutationOptionsError = Error,
>({
    children,
    loading = null,
    ...props
}: CreateBaseProps<RecordType, ResultRecordType, MutationOptionsError>) => {
    const controllerProps = useCreateController<
        RecordType,
        MutationOptionsError,
        ResultRecordType
    >(props);

    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'create',
    });

    if (isAuthPending && !props.disableAuthentication) {
        return loading;
    }

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <CreateContextProvider value={controllerProps}>
                {children}
            </CreateContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface CreateBaseProps<
    RecordType extends Omit<RaRecord, 'id'> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
    MutationOptionsError = Error,
> extends CreateControllerProps<
        RecordType,
        MutationOptionsError,
        ResultRecordType
    > {
    children: ReactNode;
    loading?: ReactNode;
}
