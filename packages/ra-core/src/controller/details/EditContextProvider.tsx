import * as React from 'react';
import { ReactElement } from 'react';
import { Record } from '../../types';
import { RecordContextProvider } from '../RecordContext';
import { EditContext } from './EditContext';
import { EditControllerProps } from './useEditController';
import { SaveContextProvider, usePickSaveContext } from './SaveContext';

/**
 * Create an Edit Context.
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
 *     const record = useRecordContext();
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
        <SaveContextProvider value={usePickSaveContext(value)}>
            <RecordContextProvider<Partial<Record>>
                value={value && value.record}
            >
                {children}
            </RecordContextProvider>
        </SaveContextProvider>
    </EditContext.Provider>
);
