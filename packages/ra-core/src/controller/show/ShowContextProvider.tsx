import * as React from 'react';
import { ReactNode } from 'react';
import { RaRecord } from '../../types';
import { RecordContextProvider } from '../record/RecordContext';
import { ShowContext } from './ShowContext';
import { ShowControllerResult } from './useShowController';

/**
 * Create a Show Context.
 *
 * @example
 *
 * const MyShow = (props) => {
 *     const controllerProps = useShowController(props);
 *     return (
 *         <ShowContextProvider value={controllerProps}>
 *             <MyShowView>
 *         </ShowContextProvider>
 *     );
 * };
 *
 * const MyShowView = () => {
 *     const record = useRecordContext();
 * }
 *
 * @see ShowContext
 * @see RecordContext
 */
export const ShowContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: ShowControllerResult;
}) => (
    <ShowContext.Provider value={value}>
        <RecordContextProvider<Partial<RaRecord>> value={value && value.record}>
            {children}
        </RecordContextProvider>
    </ShowContext.Provider>
);
