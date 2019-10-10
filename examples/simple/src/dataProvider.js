import jsonRestProvider from 'ra-data-fakerest';

import data from './data';
import addUploadFeature from './addUploadFeature';
import {
    GET_TREE_ROOT_NODES,
    GET_TREE_CHILDREN_NODES,
    MOVE_NODE,
} from 'ra-tree-core';
import { CREATE } from 'ra-core';

const dataProvider = jsonRestProvider(data, true);

const dataProviderWithTree = async (type, resource, params) => {
    if (type === GET_TREE_ROOT_NODES) {
        return dataProvider('GET_LIST', resource, {
            filter: { parent_id: null },
            sort: { field: 'position', order: 'ASC' },
            pagination: { page: 1, perPage: 1000 },
        });
    }

    if (type === GET_TREE_CHILDREN_NODES) {
        return dataProvider('GET_LIST', resource, {
            filter: { parent_id: params },
            sort: { field: 'position', order: 'ASC' },
            pagination: { page: 1, perPage: 1000 },
        });
    }

    if (type === MOVE_NODE) {
        const { data } = await dataProvider('GET_LIST', resource, {
            filter: { parent_id: params.data.parent_id },
            sort: { field: 'position', order: 'ASC' },
            pagination: { page: 1, perPage: 1000 },
        });

        await Promise.all(
            data.map(node => {
                if (node.position < params.data.position) {
                    return Promise.resolve();
                }
                return dataProvider('UPDATE', resource, {
                    id: node.id,
                    data: {
                        position: node.position + 1,
                    },
                });
            })
        );

        return dataProvider('UPDATE', resource, {
            id: params.data.id,
            data: params.data,
        });
    }

    if (type === CREATE && resource === 'tags') {
        const { data } = await dataProvider('GET_LIST', resource, {
            filter: { parent_id: params.data.parent_id },
            sort: { field: 'position', order: 'ASC' },
            pagination: { page: 1, perPage: 1000 },
        });

        await Promise.all(
            data.map(node => {
                if (node.position < params.data.position) {
                    return Promise.resolve();
                }
                return dataProvider('UPDATE', resource, {
                    id: node.id,
                    data: {
                        position: node.position + 1,
                    },
                });
            })
        );

        return dataProvider(type, resource, params);
    }

    return dataProvider(type, resource, params);
};

const uploadCapableDataProvider = addUploadFeature(dataProviderWithTree);

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

export default delayedDataProvider;
