import { createContext, useContext } from 'react';
import pick from 'lodash/pick';
import { Record } from '../types';

export interface RecordContextValue {
    record?: Record;
    loaded: boolean;
    loading: boolean;
}

/**
 * Context to store the result of the useRecord() hook.
 *
 * Use the useRecordContext() hook to read the context. That's what the Edit components do in react-admn.
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
export const RecordContext = createContext<RecordContextValue>({
    loaded: null,
    loading: null,
    record: null,
});

RecordContext.displayName = 'RecordContext';

export const usePickRecordContext = <
    ContextType extends RecordContextValue = RecordContextValue
>(
    context: ContextType
) => {
    return pick(context, ['record', 'loaded', 'loading']);
};

/**
 * Hook to read the record from a context which provide one, such as the EditContext or ShowContext.
 *
 * Must be used within a <EditContextProvider> (e.g. as a descendent of <Edit>
 * or <EditBase>) or within a <ShowContextProvider> (e.g. as a descendent of <Show>
 * or <ShowBase>)
 *
 * @returns {RecordContextValue} The record context
 */
export const useRecordContext = () => {
    const context = useContext<RecordContextValue>(RecordContext);

    if (!context) {
        console.warn(
            `The useRecordContext hook should be used inside a Provider which provides a record such as the <EditContextProvider> (e.g. as a descendent of <Edit> or <EditBase>) or within a <ShowContextProvider> (e.g. as a descendent of <Show> or <ShowBase>)`
        );
    }
    return context;
};
