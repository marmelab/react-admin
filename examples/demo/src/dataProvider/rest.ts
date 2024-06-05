import simpleRestProvider from 'ra-data-simple-rest';

const restProvider = simpleRestProvider('http://localhost:4000');

const delayedDataProvider = new Proxy(restProvider, {
    get: (target, name, self) => {
        // as we await for the dataProvider, JS calls then on it. We must trap that call or else the dataProvider will be called with the then method
        if (name === 'then') {
            return self;
        }
        if (name === 'supportAbortSignal') {
            return restProvider.supportAbortSignal;
        }
        return (resource: string, params: any) =>
            new Promise(resolve =>
                setTimeout(
                    () =>
                        resolve(restProvider[name as string](resource, params)),
                    500
                )
            );
    },
});

delayedDataProvider.supportAbortSignal = import.meta.env.MODE === 'production';
export default delayedDataProvider;
