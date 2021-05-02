import { createContext } from 'react';
import { EditControllerProps } from './useEditController';

/**
 * Context to store the result of the useEditController() hook.
 *
 * Use the useEditContext() hook to read the context. That's what the Edit components do in react-admin.
 *
 * @example
 *
 * import { useEditController, EditContextProvider } from 'ra-core';
 *
 * const Edit = props => {
 *     const controllerProps = useEditController(props);
 *     return (
 *         <EditContextProvider value={controllerProps}>
 *             ...
 *         </EditContextProvider>
 *     );
 * };
 */
export const EditContext = createContext<EditControllerProps>({
    basePath: null,
    record: null,
    defaultTitle: null,
    loaded: null,
    loading: null,
    onFailureRef: null,
    onSuccessRef: null,
    transformRef: null,
    redirect: null,
    setOnFailure: null,
    setOnSuccess: null,
    setTransform: null,
    refetch: null,
    resource: null,
    save: null,
    saving: null,
    successMessage: null,
    version: null,
});

EditContext.displayName = 'EditContext';
