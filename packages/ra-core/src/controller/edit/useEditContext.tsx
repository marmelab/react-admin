import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import { RaRecord } from '../../types';
import { EditContext } from './EditContext';
import { EditControllerResult } from './useEditController';

/**
 * Hook to read the edit controller props from the CreateContext.
 *
 * Mostly used within a <EditContext.Provider> (e.g. as a descendent of <Edit>).
 *
 * But you can also use it without a <EditContext.Provider>. In this case, it is up to you
 * to pass all the necessary props.
 *
 * The given props will take precedence over context values.
 *
 * @typedef {Object} EditControllerProps
 *
 * @returns {EditControllerResult} edit controller props
 *
 * @see useEditController for how it is filled
 *
 */
export const useEditContext = <RecordType extends RaRecord = any>(
    props?: any
): EditControllerResult<RecordType> => {
    const context = useContext(EditContext);
    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractEditContextProps<RecordType>(props) : {},
                context
            ),
        [context, props]
    );
};

/**
 * Extract only the edit controller props
 *
 * @param {Object} props props passed to the useEditContext hook
 *
 * @returns {EditControllerResult} edit controller props
 */
const extractEditContextProps = <RecordType extends RaRecord = any>({
    data,
    record,
    defaultTitle,
    isFetching,
    isLoading,
    isPending,
    mutationMode,
    redirect,
    resource,
    save,
    saving,
}: Partial<EditControllerResult<RecordType>> & Record<string, any>) => ({
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data: record || data,
    record: record || data,
    defaultTitle,
    isFetching,
    isLoading,
    isPending,
    mutationMode,
    redirect,
    resource,
    save,
    saving,
});
