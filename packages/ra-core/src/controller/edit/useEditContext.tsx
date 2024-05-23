import { useContext } from 'react';

import { RaRecord } from '../../types';
import { EditContext } from './EditContext';
import { EditControllerResult } from './useEditController';

/**
 * Hook to read the edit controller props from the EditContext.
 *
 * Used within a <EditContextProvider> (e.g. as a descendent of <Edit>).
 *
 * @returns {EditControllerResult} edit controller props
 *
 * @see useEditController for how it is filled
 */
export const useEditContext = <
    RecordType extends RaRecord = any,
>(): EditControllerResult<RecordType> => {
    const context = useContext(EditContext);
    if (!context) {
        throw new Error(
            'useEditContext must be used inside an EditContextProvider'
        );
    }
    return context;
};
