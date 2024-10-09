import * as React from 'react';
import { Navigate } from 'react-router';
import { useFirstResourceWithListAccess } from './useFirstResourceWithListAccess';
import { useCreatePath } from '../routing';

/**
 * This component will inspect the registered resources and navigate to the first one for which users have access to the list page.
 * @param props
 * @param props.loading The component to display while the component is loading.
 */
export const NavigateToFirstResource = ({
    loading: LoadingPage,
}: NavigateToFirstResourceProps) => {
    const { resource, isPending } = useFirstResourceWithListAccess();
    const createPath = useCreatePath();

    if (isPending) {
        return <LoadingPage />;
    }

    if (resource) {
        return (
            <Navigate
                to={createPath({
                    resource,
                    type: 'list',
                })}
                replace={true}
            />
        );
    }
};

export type NavigateToFirstResourceProps = {
    loading: React.ComponentType;
};
