import * as React from 'react';
import { ReactNode } from 'react';

import { RaRecord } from '../../types';
import { useEditController, EditControllerProps } from './useEditController';
import { EditContextProvider } from './EditContextProvider';

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
export const EditBase = <RaRecordType extends RaRecord = any>({
    children,
    ...props
}: { children: ReactNode } & EditControllerProps<RaRecordType>) => (
    <EditContextProvider value={useEditController<RaRecordType>(props)}>
        {children}
    </EditContextProvider>
);
