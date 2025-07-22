// only install the mocks once
// this is necessary with react@18 in StrictMode
let fakeServer: any;
import { http } from 'msw';
import { setupWorker } from 'msw/browser';

export default async (type: string) => {
    if (!fakeServer) {
        switch (type) {
            case 'graphql':
                fakeServer = await import('./graphql').then(factory =>
                    factory.default()
                );
                break;
            default:
                fakeServer = await import('./rest').then(factory =>
                    factory.default()
                );
        }
    }
    const worker = setupWorker(http.all(/http:\/\/localhost:4000/, fakeServer));
    return worker;
};
