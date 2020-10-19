import * as React from 'react';
import { useMemo } from 'react';
import useEditController from './useEditController';
import { EditContextProvider } from './EditContextProvider';
import { SideEffectContext } from './saveModifiers';

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
 * const PostEdit = props => (
 *     <BaseEdit {...props}>
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
 *     </BaseList>
 * );
 */
export const EditBase = ({
    children,
    setOnFailure,
    setOnSuccess,
    setTransform,
    ...props
}) => {
    const sideEffectContextValue = useMemo(
        () => ({ setOnSuccess, setOnFailure, setTransform }),
        [setOnFailure, setOnSuccess, setTransform]
    );

    return (
        <EditContextProvider value={useEditController(props)}>
            <SideEffectContext.Provider value={sideEffectContextValue}>
                {children}
            </SideEffectContext.Provider>
        </EditContextProvider>
    );
};
