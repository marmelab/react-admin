import { RaRecord } from 'ra-core';
import { createList, TypedList } from './createList';

export const createResource = <TRecord extends RaRecord>() => {
    return {
        createList: function <
            Filters extends Record<string, unknown> = TRecord
        >(renderer: TypedList<TRecord, Filters>) {
            return createList<TRecord, Filters>(renderer);
        },
    };
};
