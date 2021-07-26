import {
    convertLegacyDataProvider,
    DataProvider,
    LegacyDataProvider,
} from 'react-admin';
import fakeServerFactory from '../fakeServer';

export default (type: string) => {
    // The fake servers require to generate data, which can take some time.
    // Here we start the server initialization but we don't wait for it to finish
    let dataProviderPromise = getDataProvider(type);

    // Instead we return this proxy which may be called immediately by react-admin if the
    // user is already signed-in. In this case, we simply wait for the dataProvider promise
    // to complete before requesting it the data.
    // If the user isn't signed in, we already started the server initialization while they see
    // the login page. By the time they come back to the admin as a signed-in user,
    // the fake server will be initialized.
    const dataProviderWithGeneratedData = new Proxy(defaultDataProvider, {
        get(_, name) {
            return (resource: string, params: any) => {
                return dataProviderPromise.then(dataProvider => {
                    // We have to convert the dataProvider here otherwise the proxy would try to intercept the promise resolution
                    if (typeof dataProvider === 'function') {
                        return convertLegacyDataProvider(dataProvider)[
                            name.toString()
                        ](resource, params);
                    }
                    return dataProvider[name.toString()](resource, params);
                });
            };
        },
    });

    return dataProviderWithGeneratedData;
};

const getDataProvider = async (
    type: string
): Promise<DataProvider | LegacyDataProvider> => {
    await fakeServerFactory(process.env.REACT_APP_DATA_PROVIDER || '');
    /**
     * This demo can work with either a fake REST server, or a fake GraphQL server.
     *
     * To avoid bundling both libraries, the dataProvider and fake server factories
     * use the import() function, so they are asynchronous.
     */
    if (type === 'graphql') {
        return import('./graphql').then(factory => factory.default());
    }
    return import('./rest').then(provider => provider.default);
};

const defaultDataProvider: DataProvider = {
    // @ts-ignore
    create: () => Promise.resolve({ data: { id: 0 } }),
    delete: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({}),
    getList: () => Promise.resolve({ data: [], total: 0 }),
    getMany: () => Promise.resolve({ data: [] }),
    getManyReference: () => Promise.resolve({ data: [], total: 0 }),
    // @ts-ignore
    getOne: () => Promise.resolve({ data: {} }),
    // @ts-ignore
    update: () => Promise.resolve({ data: {} }),
    updateMany: () => Promise.resolve({}),
};
