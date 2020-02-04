import {
    GetOneParams,
    GetOneResult,
    GetManyParams,
    GetManyResult,
} from '../types';

export const canReplyWithCache = (type, resource, payload, resourcesData) => {
    const resourceData = resourcesData[resource];
    const now = new Date();
    switch (type) {
        case 'getOne':
            return resourceData.validity[(payload as GetOneParams).id] > now;
        case 'getMany':
            return (payload as GetManyParams).ids.every(
                id => resourceData.validity[id] > now
            );
        default:
            return false;
    }
};

export const getResultFromCache = (type, resource, payload, resourcesData) => {
    const resourceData = resourcesData[resource];
    switch (type) {
        case 'getOne':
            return { data: resourceData.data[payload.id] } as GetOneResult;
        case 'getMany':
            return {
                data: payload.ids.map(id => resourceData.data[id]),
            } as GetManyResult;
        default:
            throw new Error('cannot reply with cache for this method');
    }
};
