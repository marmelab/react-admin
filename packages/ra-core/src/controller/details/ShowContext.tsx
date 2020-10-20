import { createContext, useContext } from 'react';
import { Record } from '../../types';
import { ShowControllerProps } from './useShowController';

/**
 * Context to store the result of the useShowController() hook.
 *
 * Use the useShowContext() hook to read the context. That's what the Show components do in react-admin.
 *
 * @example
 *
 * import { useShowController, ShowContext } from 'ra-core';
 *
 * const Show = props => {
 *     const controllerProps = useShowController(props);
 *     return (
 *         <ShowContext.Provider value={controllerProps}>
 *             ...
 *         </ShowContext.Provider>
 *     );
 * };
 */
export const ShowContext = createContext<ShowControllerProps>({
    basePath: null,
    record: null,
    defaultTitle: null,
    loaded: null,
    loading: null,
    resource: null,
    version: null,
});

ShowContext.displayName = 'ShowContext';

export const useShowContext = <
    RecordType extends Record = Record
>(): ShowControllerProps<RecordType> => {
    const context = useContext(ShowContext);

    // @ts-ignore
    return context;
};
