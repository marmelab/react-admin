import jsonRestDataProvider from 'ra-data-fakerest';

import data from './data';
import addUploadFeature from './addUploadFeature';

const dataProvider = jsonRestDataProvider(data, true);
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

export default delayedDataProvider;
