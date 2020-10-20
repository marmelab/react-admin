import * as React from 'react';
import { ReactElement } from 'react';
import { RecordContext, usePickRecordContext } from '../RecordContext';
import { CreateContext } from './CreateContext';
import { CreateControllerProps } from './useCreateController';
import { SideEffectContext, usePickSideEffectContext } from '../saveModifiers';
import { SaveContext, usePickSaveContext } from '../SaveContext';

/**
 * Create a Create Context.
 *
 * @example
 *
 * const MyCreate = (props) => {
 *     const controllerProps = useCreateController(props);
 *     return (
 *         <CreateContextProvider value={controllerProps}>
 *             <MyCreateView>
 *         </CreateContextProvider>
 *     );
 * };
 *
 * const MyCreateView = () => {
 *     const { record } = useRecordContext();
 *     // or, to rerender only when the save operation change but not data
 *     const { saving } = useCreateContext();
 * }
 *
 * @see CreateContext
 * @see RecordContext
 */
export const CreateContextProvider = ({
    children,
    value,
}: {
    children: ReactElement;
    value: CreateControllerProps;
}) => (
    <CreateContext.Provider value={value}>
        <SideEffectContext.Provider value={usePickSideEffectContext(value)}>
            <SaveContext.Provider value={usePickSaveContext(value)}>
                <RecordContext.Provider value={usePickRecordContext(value)}>
                    {children}
                </RecordContext.Provider>
            </SaveContext.Provider>
        </SideEffectContext.Provider>
    </CreateContext.Provider>
);
