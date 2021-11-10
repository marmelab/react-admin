import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import { Record } from '../../types';
import { CreateContext } from './CreateContext';
import { CreateControllerProps } from './useCreateController';

/**
 * Hook to read the create controller props from the CreateContext.
 *
 * Mostly used within a <CreateContext.Provider> (e.g. as a descendent of <Create>).
 *
 * But you can also use it without a <CreateContext.Provider>. In this case, it is up to you
 * to pass all the necessary props.
 *
 * The given props will take precedence over context values.
 *
 * @typedef {Object} CreateControllerProps
 *
 * @returns {CreateControllerProps} create controller props
 *
 * @see useCreateController for how it is filled
 *
 */
export const useCreateContext = <
    RecordType extends Omit<Record, 'id'> = Omit<Record, 'id'>
>(
    props?: Partial<CreateControllerProps<RecordType>>
): Partial<CreateControllerProps<RecordType>> => {
    const context = useContext<CreateControllerProps<RecordType>>(
        // Can't find a way to specify the RecordType when CreateContext is declared
        // @ts-ignore
        CreateContext
    );
    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractCreateContextProps(props) : {},
                context
            ),
        [context, props]
    );
};

/**
 * Extract only the create controller props
 *
 * @param {Object} props props passed to the useCreateContext hook
 *
 * @returns {CreateControllerProps} create controller props
 */
const extractCreateContextProps = ({
    basePath,
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
});
