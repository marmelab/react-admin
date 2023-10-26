import buildDataProvider from './index';
import { DataProviderExtensions } from './index';

describe('GraphQL data provider', () => {
    it('supports Data Provider Extensions', async () => {
        const dataProvider = await buildDataProvider({
            clientOptions: { uri: 'http://localhost:4000' },
            extensions: [DataProviderExtensions.Realtime],
        });

        expect(dataProvider.subscribe).toBeDefined();
        expect(dataProvider.unsubscribe).toBeDefined();
    });
});
