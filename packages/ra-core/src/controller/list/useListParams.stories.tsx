import * as React from 'react';
import { CoreAdminContext } from '../../..';
import { useListParams } from '.';

export default { title: 'ra-core/controller/list/useListParams' };

const UseListParamsFilterDebugger = () => {
    const [listParams, listParamsActions] = useListParams({
        resource: 'posts',
    });
    const currentFilterValue =
        (listParams.filterValues as { q?: string }).q || '';
    const triggerBug = async (debounce = false) => {
        listParamsActions.setFilters(
            {
                q: `${currentFilterValue}a`,
            },
            undefined,
            debounce
        );
        await new Promise(resolve => setTimeout(resolve, debounce ? 500 : 0));
        listParamsActions.setFilters(
            {
                q: `${currentFilterValue}b`,
            },
            undefined,
            debounce
        );
    };
    return (
        <>
            <p>filterValues</p>
            <pre>{JSON.stringify(listParams.filterValues, null, 2)}</pre>
            <button onClick={() => triggerBug(false)}>
                Trigger bug (no debounce)
            </button>
            <button onClick={() => triggerBug(true)}>
                Trigger bug (debounce)
            </button>
        </>
    );
};

export const RaceCondition = () => (
    <CoreAdminContext>
        <UseListParamsFilterDebugger />
    </CoreAdminContext>
);
