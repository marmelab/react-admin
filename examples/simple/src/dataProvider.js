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
        return uploadCapableDataProvider[name](resource, params);
    },
});
const delayedDataProvider = new Proxy(sometimesFailsDataProvider, {
    get: (target, name) => (resource, params) =>
        new Promise(resolve =>
            setTimeout(
                () =>
                    resolve(sometimesFailsDataProvider[name](resource, params)),
                1000
            )
        ),
});

export default delayedDataProvider;
