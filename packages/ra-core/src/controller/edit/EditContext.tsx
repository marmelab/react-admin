import { createContext } from 'react';
import { EditControllerResult } from './useEditController';

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
export const EditContext = createContext<EditControllerResult>({
    isFetching: false,
    isLoading: false,
    isPending: false,
    redirect: false,
    refetch: () => Promise.reject('not implemented'),
    resource: '',
    saving: false,
});

EditContext.displayName = 'EditContext';
