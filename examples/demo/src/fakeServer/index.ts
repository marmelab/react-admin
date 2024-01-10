// only install the mocks once
// this is necessary with react@18 in StrictMode
let fakeServer: any;

export default (type: string) => {
    if (!fakeServer) {
        switch (type) {
            case 'graphql':
                fakeServer = import('./graphql').then(factory =>
                    factory.default()
                );
                break;
            default:
                fakeServer = import('./rest').then(factory =>
                    factory.default()
                );
        }
    }
    return fakeServer;
};
