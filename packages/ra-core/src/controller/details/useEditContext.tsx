import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import { Record } from '../../types';
import { EditContext } from './EditContext';
import { EditControllerProps } from './useEditController';

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
 * @returns {EditControllerProps} edit controller props
 *
 * @see useEditController for how it is filled
 *
 */
export const useEditContext = <RecordType extends Record = Record>(
    props?: Partial<EditControllerProps<RecordType>>
): Partial<EditControllerProps<RecordType>> => {
    // Can't find a way to specify the RecordType when EditContext is declared
    // @ts-ignore
    const context = useContext<EditControllerProps<RecordType>>(EditContext);

    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractEditContextProps(props) : {},
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
 * @returns {EditControllerProps} edit controller props
 */
const extractEditContextProps = ({
    basePath,
    data,
    record,
    defaultTitle,
    onFailureRef,
    onSuccessRef,
    transformRef,
    loaded,
    loading,
    redirect,
    setOnFailure,
    setOnSuccess,
    setTransform,
    resource,
    save,
    saving,
    successMessage,
    version,
}: any) => ({
    basePath,
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    data: record || data,
    record: record || data,
    defaultTitle,
    onFailureRef,
    onSuccessRef,
    transformRef,
    loaded,
    loading,
    redirect,
    setOnFailure,
    setOnSuccess,
    setTransform,
    resource,
    save,
    saving,
    successMessage,
    version,
});
