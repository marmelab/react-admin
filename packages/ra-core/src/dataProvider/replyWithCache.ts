import get from 'lodash/get';
import {
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    GetManyParams,
    GetManyResult,
} from '../types';

export const canReplyWithCache = (type, payload, resourceState) => {
    const now = new Date();
    switch (type) {
        case 'getList':
            return (
                get(resourceState, [
                    'list',
                    'cachedRequests',
                    JSON.stringify(payload as GetListParams),
                    'validity',
                ]) > now
            );
        case 'getOne':
            return (
                resourceState &&
                resourceState.validity &&
                resourceState.validity[(payload as GetOneParams).id] > now
            );

        case 'getMany':
            return (
                resourceState &&
                resourceState.validity &&
                (payload as GetManyParams).ids.every(
                    id => resourceState.validity[id] > now
                )
            );
        default:
            return false;
    }
};

export const getResultFromCache = (type, payload, resourceState) => {
    switch (type) {
        case 'getList': {
            const data = resourceState.data;
            const requestSignature = JSON.stringify(payload);
            const cachedRequest =
                resourceState.list.cachedRequests[requestSignature];
            return {
                data: cachedRequest.ids.map(id => data[id]),
                total: cachedRequest.total,
            } as GetListResult;
        }
        case 'getOne':
            return { data: resourceState.data[payload.id] } as GetOneResult;
        case 'getMany':
            return {
                data: payload.ids.map(id => resourceState.data[id]),
            } as GetManyResult;
        default:
            throw new Error('cannot reply with cache for this method');
    }
};
