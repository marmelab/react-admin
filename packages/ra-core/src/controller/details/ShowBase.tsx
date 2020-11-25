import * as React from 'react';
import { useShowController } from './useShowController';
import { ShowContextProvider } from './ShowContextProvider';

/**
 * Call useShowController and put the value in a ShowContext
 *
 * Base class for <Show> components, without UI.
 *
 * Accepts any props accepted by useShowController:
 * - id: The record identifier
 * - resource: The resource
 *
 * @example // Custom edit layout
 *
 * const PostShow = props => (
 *     <ShowBase {...props}>
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
export const ShowBase = ({ children, ...props }) => (
    <ShowContextProvider value={useShowController(props)}>
        {children}
    </ShowContextProvider>
);
