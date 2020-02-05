import fakeRestProvider from 'ra-data-fakerest';

import data from './data';
import addUploadFeature from './addUploadFeature';

const dataProvider = fakeRestProvider(data, true);
const uploadCapableDataProvider = addUploadFeature(dataProvider);
const sometimesFailsDataProvider = new Proxy(uploadCapableDataProvider, {
    get: (target, name) => (resource, params) => {
        // add rejection by type or resource here for tests, e.g.
        // if (name === 'delete' && resource === 'posts') {
        //     return Promise.reject(new Error('deletion error'));
        // }
        // test cache
        if (name === 'getList' || name === 'getMany' || name === 'getOne') {
            return uploadCapableDataProvider[name](resource, params).then(
                response => {
                    const validUntil = new Date();
                    validUntil.setTime(validUntil.getTime() + 5 * 60 * 1000); // five minutes
                    response.validUntil = validUntil;
                    return response;
                }
            );
        }
        return uploadCapableDataProvider[name](resource, params);
    },
});
const delayedDataProvider = new Proxy(sometimesFailsDataProvider, {
    get: (target, name) => (resource, params) =>
        new Promise(resolve =>
            setTimeout(
                () =>
                    resolve(sometimesFailsDataProvider[name](resource, params)),
                300
            )
        ),
});

export default delayedDataProvider;
