import * as React from 'react';
import { ReactElement } from 'react';
import { RecordContext, usePickRecordContext } from './RecordContext';
import { EditContext } from './EditContext';
import { EditControllerProps } from './useEditController';
import { SideEffectContext, usePickSideEffectContext } from './saveModifiers';

/**
 * Create a Edit Context.
 *
 * @example
 *
 * const MyEdit = (props) => {
 *     const controllerProps = useEditController(props);
 *     return (
 *         <EditContextProvider value={controllerProps}>
 *             <MyEditView>
 *         </EditContextProvider>
 *     );
 * };
 *
 * const MyEditView = () => {
 *     const { record } = useRecordContext();
 *     // or, to rerender only when the save operation change but not data
 *     const { saving } = useEditContext();
 * }
 *
 * @see EditContext
 * @see RecordContext
 */
export const EditContextProvider = ({
    children,
    value,
}: {
    children: ReactElement;
    value: EditControllerProps;
}) => (
    <EditContext.Provider value={value}>
        <SideEffectContext.Provider value={usePickSideEffectContext(value)}>
            <RecordContext.Provider value={usePickRecordContext(value)}>
                {children}
            </RecordContext.Provider>
        </SideEffectContext.Provider>
    </EditContext.Provider>
);
