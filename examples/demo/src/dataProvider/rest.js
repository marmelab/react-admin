import simpleRestProvider from 'ra-data-simple-rest';

const restDataProvider = simpleRestProvider('http://localhost:4000');
export default (type, resource, params) =>
    new Promise(resolve =>
        setTimeout(() => resolve(restDataProvider(type, resource, params)), 500)
    );
