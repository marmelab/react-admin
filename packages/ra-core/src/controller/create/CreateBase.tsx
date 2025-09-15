import * as React from 'react';
import { ReactNode } from 'react';
import {
    useCreateController,
    CreateControllerProps,
    CreateControllerResult,
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
    render,
    loading,
    authLoading = loading,
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

    if (!render && !children) {
        throw new Error(
            '<CreateBase> requires either a `render` prop or `children` prop'
        );
    }

    const showAuthLoading =
        isAuthPending &&
        !props.disableAuthentication &&
        authLoading !== false &&
        authLoading !== undefined;

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <CreateContextProvider value={controllerProps}>
                {showAuthLoading
                    ? authLoading
                    : render
                      ? render(controllerProps)
                      : children}
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
    children?: ReactNode;
    render?: (props: CreateControllerResult<RecordType>) => ReactNode;
    authLoading?: ReactNode;
    /**
     * @deprecated use authLoading instead
     */
    loading?: ReactNode;
}
