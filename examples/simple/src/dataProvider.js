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
        return new Promise(resolve =>
            setTimeout(() => {
                const items = data.tags.filter(item => !item.parent_id);
                resolve({
                    data: items.map(item => ({
                        ...item,
                        hasChildren:
                            data.tags.filter(
                                child => child.parent_id === item.id
                            ).length > 0,
                    })),
                });
            }, 1000)
        );
    }

    if (type === 'GET_LEAF_NODES') {
        return new Promise(resolve =>
            setTimeout(() => {
                const items = data.tags.filter(
                    item => item.parent_id === params.parentId
                );
                resolve({
                    data: items.map(item => ({
                        ...item,
                        hasChildren:
                            data.tags.filter(
                                child => child.parent_id === item.id
                            ).length > 0,
                    })),
                });
            }, 1000)
        );
    }

    return delayedDataProvider(type, resource, params);
};
