import jsonRestProvider from 'ra-data-fakerest';

import data from './data';
import addUploadFeature from './addUploadFeature';

const dataProvider = jsonRestProvider(data, true);
const uploadCapableDataProvider = addUploadFeature(dataProvider);

const sometimesFailsDataProvider = (type, resource, params) =>
    new Promise((resolve, reject) => {
        // add rejection by type or resource here for tests, e.g.
        // if (type === 'DELETE' && resource === 'posts') {
        //     return reject('deletion error');
        // }
        return resolve(uploadCapableDataProvider(type, resource, params));
    });
const delayedDataProvider = (type, resource, params) =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(sometimesFailsDataProvider(type, resource, params)),
            1000
        )
    );

export default (type, resource, params) => {
    if (type === 'GET_ROOT_NODES') {
        return dataProvider('GET_LIST', resource, {
            filter: { parent_id: null },
            sort: { field: params.positionField, order: 'ASC' },
            pagination: { page: 1, perPage: 1000 },
        }).then(({ data, total }) =>
            Promise.all(
                data.map(item =>
                    dataProvider('GET_LIST', resource, {
                        filter: { parent_id: item.id },
                        sort: { field: params.positionField, order: 'ASC' },
                        pagination: { page: 1, perPage: 1 },
                    }).then(({ total }) => ({
                        ...item,
                        hasChildren: total > 0,
                    }))
                )
            ).then(nodes => ({
                data: nodes,
                total,
            }))
        );
    }

    if (type === 'GET_LEAF_NODES') {
        return dataProvider('GET_LIST', resource, {
            filter: { parent_id: params.parentId },
            sort: { field: params.positionField, order: 'ASC' },
            pagination: { page: 1, perPage: 1000 },
        }).then(({ data, total }) =>
            Promise.all(
                data.map(item =>
                    dataProvider('GET_LIST', resource, {
                        filter: { parent_id: item.id },
                        sort: { field: params.positionField, order: 'ASC' },
                        pagination: { page: 1, perPage: 1 },
                    }).then(({ total }) => ({
                        ...item,
                        hasChildren: total > 0,
                    }))
                )
            ).then(nodes => ({
                data: nodes,
                total,
            }))
        );
    }

    return delayedDataProvider(type, resource, params);
};
