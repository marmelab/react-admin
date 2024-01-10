import * as React from 'react';
import { ReactElement } from 'react';

import { RaRecord } from '../../types';
import { useShowController, ShowControllerProps } from './useShowController';
import { ShowContextProvider } from './ShowContextProvider';
import { ResourceContextProvider } from '../../core';

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
    ...props
}: { children: ReactElement } & ShowControllerProps<RecordType>) => {
    const controllerProps = useShowController<RecordType>(props);
    const body = (
        <ShowContextProvider value={controllerProps}>
            {children}
        </ShowContextProvider>
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
