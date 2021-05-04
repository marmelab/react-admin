import fakerestDataProvider from 'ra-data-fakerest';

import generateData from './dataGenerator';

const baseDataProvider = fakerestDataProvider(generateData(), true);

export const dataProvider = new Proxy(baseDataProvider, {
    get: (target, name: string) => (resource: string, params: any) =>
        new Promise(resolve =>
            setTimeout(
                () => resolve(baseDataProvider[name](resource, params)),
                300
            )
        ),
});
