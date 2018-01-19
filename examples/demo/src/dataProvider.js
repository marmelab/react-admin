import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestProvider('http://localhost:3000');

export default (type, resource, params) => 
    new Promise(resolve => 
        setTimeout(() => resolve(dataProvider(type, resource, params)), 500)
    );
