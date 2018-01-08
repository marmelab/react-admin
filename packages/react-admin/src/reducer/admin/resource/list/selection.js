import {
    CRUD_CHANGE_LIST_SELECTION,
    CRUD_CHANGE_LIST_PARAMS,
    CRUD_CLEAR_LIST_SELECTION,
    CRUD_DELETE_SUCCESS,
    CRUD_BULK_ACTION_SUCCESS,
} from '../../../../actions';
import { DELETE } from '../../../../dataFetchActions';

const defaultState = {
    mode: 'bulk',
    ids: [],
};

const changeSelection = (previousState, ids, selected) =>
    selected
        ? previousState.filter(id => ids.find(it => it == id)).concat(ids)
        : previousState.filter(id => !ids.find(it => it == id));

export default resource => (
    previousState = defaultState,
    { type, requestPayload, payload, meta }
) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
        case CRUD_DELETE_SUCCESS:
            return {
                ...previousState,
                ids: changeSelection(previousState.ids, [payload.id], false),
            };
        case CRUD_BULK_ACTION_SUCCESS: {
            let { keepSuccess, keepFailed } = meta.selection;

            if (DELETE === meta.cacheAction) {
                keepSuccess = false;
            }

            if (keepSuccess && keepFailed) return previousState;

            const ids = payload.data
                .map(
                    (record, index) =>
                        (record.resolved && !keepSuccess) ||
                        (record.rejected && !keepFailed)
                            ? requestPayload.ids[index]
                            : false
                )
                .filter(t => t);
            return {
                ...previousState,
                ids: changeSelection(previousState.ids, ids, false),
            };
        }
        case CRUD_CHANGE_LIST_PARAMS: {
            switch (previousState.mode) {
                case 'page':
                    return {
                        ...previousState,
                        ids: [],
                    };
                default:
                    return previousState;
            }
        }
        case CRUD_CLEAR_LIST_SELECTION: {
            return {
                ...previousState,
                ids: [],
            };
        }

        case CRUD_CHANGE_LIST_SELECTION: {
            const { ids, mode = previousState.mode, selected } = payload;

            switch (mode) {
                case 'bulk':
                case 'page':
                    return {
                        mode,
                        ids: selected
                            ? ids.reduce(
                                  (acc, item) =>
                                      acc.indexOf(item) === -1
                                          ? acc.concat(item)
                                          : acc,
                                  previousState.ids
                              )
                            : previousState.ids.filter(
                                  prevId => ids.indexOf(prevId) === -1
                              ),
                    };
                default:
                    return {
                        mode,
                        ids: selected ? ids.map(t => t) : [],
                    };
            }
        }
        default:
            return previousState;
    }
};
