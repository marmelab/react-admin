import { createContext, useContext } from 'react';
import { Record } from '../types';
import { EditControllerProps } from './useEditController';

/**
 * Context to store the result of the useEditController() hook.
 *
 * Use the useEditContext() hook to read the context. That's what the Edit components do in react-admin.
 *
 * @example
 *
 * import { useEditController, EditContext } from 'ra-core';
 *
 * const Edit = props => {
 *     const controllerProps = useEditController(props);
 *     return (
 *         <EditContext.Provider value={controllerProps}>
 *             ...
 *         </EditContext.Provider>
 *     );
 * };
 */
export const EditContext = createContext<EditControllerProps>({
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

EditContext.displayName = 'EditContext';

export const useEditContext = <
    RecordType extends Record = Record
>(): EditControllerProps<RecordType> => {
    const context = useContext(EditContext);

    // @ts-ignore
    return context;
};
