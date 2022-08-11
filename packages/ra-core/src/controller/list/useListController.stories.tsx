import * as React from 'react';
import { CoreAdminContext } from '../../core';
import { localStorageStore } from '../../store';
import { ListController } from './ListController';
import { ListControllerResult } from './useListController';

export default {
    title: 'ra-core/controller/list/useListController',
};

const listControllerComponent = (storeKey: string, targetPerPage: number) => {
    return (
        <ListController
            resource="posts"
            debounce={200}
            perPage={23}
            disableSyncWithLocation={true}
            storeKey={storeKey}
            children={(params: ListControllerResult) => (
                <div>
                    <h3 aria-label={storeKey} data-perpage={params.perPage}>
                        {storeKey} - {params.perPage}
                    </h3>
                    <button
                        aria-label="setPerPage"
                        onClick={() => params.setPerPage(targetPerPage)}
                    >
                        setPerPage {targetPerPage}
                    </button>
                </div>
            )}
        />
    );
};
const List1 = () => listControllerComponent('list1', 51);
const List2 = () => listControllerComponent('list2', 41);

export const ListsUsingSameResource = () => {
    const [isList1, setIsList1] = React.useState(true);
    const toggle = () => setIsList1(v => !v);

    return (
        <CoreAdminContext store={localStorageStore()}>
            <div style={{ padding: '10px' }}>
                <button onClick={toggle} aria-label="toggleList">
                    Toggle
                </button>
                {isList1 ? <List1 /> : <List2 />}
            </div>
        </CoreAdminContext>
    );
};
