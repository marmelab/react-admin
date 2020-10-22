import * as React from 'react';
import { useCreateController } from './useCreateController';
import { CreateContextProvider } from './CreateContextProvider';

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
 *     <BaseCreate {...props}>
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
 *     </BaseCreate>
 * );
 */
export const CreateBase = ({ children, ...props }) => (
    <CreateContextProvider value={useCreateController(props)}>
        {children}
    </CreateContextProvider>
);
