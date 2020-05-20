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
    const requestSignature = JSON.stringify(payload);
    const cachedRequest = resourceState.cachedRequests[requestSignature];

    switch (type) {
        case 'getList': {
            const data = resourceState.data;
            const cachedListRequest =
                resourceState.list.cachedRequests[requestSignature];
            return {
                ...{
                    data: cachedListRequest.ids.map(id => data[id]),
                    total: cachedListRequest.total,
                },
                ...(cachedRequest ? { meta: cachedRequest.meta } : {}),
            } as GetListResult;
        }
        case 'getOne':
            return {
                ...{
                    data: resourceState.data[payload.id],
                },
                ...(cachedRequest ? { meta: cachedRequest.meta } : {}),
            } as GetOneResult;
        case 'getMany':
            return {
                data: payload.ids.map(id => resourceState.data[id]),
            } as GetManyResult;
        default:
            throw new Error('cannot reply with cache for this method');
    }
};
