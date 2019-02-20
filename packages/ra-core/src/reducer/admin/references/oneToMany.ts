import { Reducer } from 'redux';
import {
    CRUD_GET_MANY_REFERENCE_SUCCESS,
    CrudGetManyReferenceSuccessAction,
} from '../../../actions/dataActions';
import { Identifier, ReduxState } from '../../../types';

const initialState = {};

interface State {
    [relatedTo: string]: { ids: Identifier[]; total: number };
}

type ActionTypes =
    | CrudGetManyReferenceSuccessAction
    | { type: 'OTHER_ACTION'; payload: any; meta?: any };

const oneToManyReducer: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    switch (action.type) {
        case CRUD_GET_MANY_REFERENCE_SUCCESS:
            return {
                ...previousState,
                [action.meta.relatedTo]: {
                    ids: action.payload.data.map(record => record.id),
                    total: action.payload.total,
                },
            };
        default:
            return previousState;
    }
};

export const getIds = (state: ReduxState, relatedTo) =>
    state.admin.references.oneToMany[relatedTo] &&
    state.admin.references.oneToMany[relatedTo].ids;

export const getTotal = (state: ReduxState, relatedTo) =>
    state.admin.references.oneToMany[relatedTo] &&
    state.admin.references.oneToMany[relatedTo].total;

export const getReferences = (state: ReduxState, reference, relatedTo) => {
    const ids = getIds(state, relatedTo);
    if (typeof ids === 'undefined') {
        return undefined;
    }

    if (!state.admin.resources[reference]) {
        // eslint-disable-next-line no-console
        console.error(
            `Invalid Resource "${reference}"\n` +
                `You are trying to display or edit a field of a resource called "${reference}", ` +
                'but it has not been declared.\n' +
                "Declare this resource in the Admin or check the 'reference' prop of ReferenceArrayField and ReferenceManyField.",
            { ids }
        );
    }

    return ids
        .map(id => {
            const resource = state.admin.resources[reference];

            if (!resource) {
                return;
            }

            return resource.data[id];
        })
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, record) => {
            prev[record.id] = record; // eslint-disable-line no-param-reassign
            return prev;
        }, {});
};

export const getReferencesByIds = (
    state: ReduxState,
    reference: string,
    ids: Identifier[]
) => {
    if (ids.length === 0) {
        return {};
    }

    if (!state.admin.resources[reference]) {
        // eslint-disable-next-line no-console
        console.error(
            `Invalid Resource "${reference}"\n` +
                `You are trying to display or edit a field of a resource called "${reference}", ` +
                'but it has not been declared.\n' +
                "Declare this resource in the Admin or check the 'reference' prop of ReferenceArrayField.",
            { ids }
        );
    }

    const references = ids
        .map(id => {
            const resource = state.admin.resources[reference];

            if (!resource) {
                return;
            }

            return resource.data[id];
        })
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, record) => {
            prev[record.id] = record; // eslint-disable-line no-param-reassign
            return prev;
        }, {});

    return Object.keys(references).length > 0 ? references : null;
};

export const nameRelatedTo = (reference, id, resource, target, filter = {}) => {
    const keys = Object.keys(filter);
    if (!keys.length) {
        return `${resource}_${reference}@${target}_${id}`;
    }

    return `${resource}_${reference}@${target}_${id}?${keys
        .map(key => `${key}=${JSON.stringify(filter[key])}`)
        .join('&')}`;
};

export default oneToManyReducer;
