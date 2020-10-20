import * as React from 'react';
import { ReactElement } from 'react';
import { RecordContext, usePickRecordContext } from './RecordContext';
import { ShowContext } from './ShowContext';
import { ShowControllerProps } from './useShowController';

/**
 * Show a Show Context.
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
 *     const { record } = useRecordContext();
 * }
 *
 * @see ShowContext
 * @see RecordContext
 */
export const ShowContextProvider = ({
    children,
    value,
}: {
    children: ReactElement;
    value: ShowControllerProps;
}) => (
    <ShowContext.Provider value={value}>
        <RecordContext.Provider value={usePickRecordContext(value)}>
            {children}
        </RecordContext.Provider>
    </ShowContext.Provider>
);
