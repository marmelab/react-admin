import { createContext, useContext } from 'react';
import { Record } from '../../types';
import { CreateControllerProps } from './useCreateController';

/**
 * Context to store the result of the useCreateController() hook.
 *
 * Use the useCreateContext() hook to read the context. That's what the Create components do in react-admin.
 *
 * @example
 *
 * import { useCreateController, CreateContext } from 'ra-core';
 *
 * const Create = props => {
 *     const controllerProps = useCreateController(props);
 *     return (
 *         <CreateContext.Provider value={controllerProps}>
 *             ...
 *         </CreateContext.Provider>
 *     );
 * };
 */
export const CreateContext = createContext<CreateControllerProps>({
    basePath: null,
    record: null,
    defaultTitle: null,
    loaded: null,
    loading: null,
    redirect: null,
    setOnFailure: null,
    setOnSuccess: null,
    setTransform: null,
    resource: null,
    save: null,
    saving: null,
    successMessage: null,
    version: null,
});

CreateContext.displayName = 'CreateContext';

export const useCreateContext = <
    RecordType extends Record = Record
>(): CreateControllerProps<RecordType> => {
    const context = useContext(CreateContext);

    // @ts-ignore
    return context;
};
