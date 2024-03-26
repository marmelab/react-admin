import { createContext } from 'react';
import { CreateControllerResult } from './useCreateController';

/**
 * Context to store the result of the useCreateController() hook.
 *
 * Use the useCreateContext() hook to read the context. That's what the Create components do in react-admin.
 *
 * @example
 *
 * import { useCreateController, CreateContextProvider } from 'ra-core';
 *
 * const Create = props => {
 *     const controllerProps = useCreateController(props);
 *     return (
 *         <CreateContextProvider value={controllerProps}>
 *             ...
 *         </CreateContextProvider>
 *     );
 * };
 */
export const CreateContext = createContext<CreateControllerResult | null>(null);

CreateContext.displayName = 'CreateContext';
