import jsonRestProvider from 'ra-data-fakerest';

import data from './data';
import addUploadFeature from './addUploadFeature';
import { COMMENT_APPROVE, COMMENT_REJECT } from './comments/actions';

const dataProvider = jsonRestProvider(data, true);

const withRandomFailure = dataProvider => (type, resource, params) =>
    new Promise((resolve, reject) => {
        // add rejection by type or resource here for tests, e.g.
        // if (type === 'DELETE' && resource === 'posts') {
        //     return reject('deletion error');
        // }
        return resolve(dataProvider(type, resource, params));
    });

const withDelay = dataProvider => (type, resource, params) =>
    new Promise(resolve =>
        setTimeout(() => resolve(dataProvider(type, resource, params)), 1000)
    );

const withCustomFetchType = dataProvider => (type, resource, params) => {
    if (type === COMMENT_APPROVE) {
        // Simulate a successfull call to a custom API route
        return dataProvider('UPDATE', resource, {
            id: params.id,
            data: { status: 'approved' },
        });
    }
    if (type === COMMENT_REJECT) {
        // Simulate a failed call to a custom API route
        return Promise.reject({});
    }

    return dataProvider(type, resource, params);
};

const compose = (...enhancers) => dataProvider =>
    enhancers.reduce((acc, enhancer) => enhancer(acc), dataProvider);

export default compose(
    addUploadFeature,
    withRandomFailure,
    withDelay,
    withCustomFetchType
)(dataProvider);
