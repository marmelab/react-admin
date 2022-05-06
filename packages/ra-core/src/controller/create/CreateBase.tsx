import * as React from 'react';
import { ReactNode } from 'react';
import {
    useCreateController,
    CreateControllerProps,
} from './useCreateController';
import { CreateContextProvider } from './CreateContextProvider';
import { RaRecord } from '../../types';
import { ResourceContextProvider } from '../../core';

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
 * const PostCreate = props => (
 *     <CreateBase {...props}>
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
export const CreateBase = <RecordType extends RaRecord = any>({
    children,
    ...props
}: CreateControllerProps<RecordType> & { children: ReactNode }) => {
    const controllerProps = useCreateController<RecordType>(props);
    const body = (
        <CreateContextProvider value={controllerProps}>
            {children}
        </CreateContextProvider>
    );
    return props.resource ? (
        // support resource override via props
        <ResourceContextProvider value={props.resource}>
            {body}
        </ResourceContextProvider>
    ) : (
        body
    );
};
