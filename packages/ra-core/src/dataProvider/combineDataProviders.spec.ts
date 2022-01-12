import { testDataProvider } from './testDataProvider';
import { combineDataProviders } from './combineDataProviders';

describe('combineDataProviders', () => {
    it('calls the right dataProvider depending on the matcher function', async () => {
        const dataProvider1 = testDataProvider({
            getOne: jest
                .fn()
                .mockResolvedValue({ data: { id: 1, foo: 'bar' } }),
        });
        const dataProvider2 = testDataProvider({
            getOne: jest
                .fn()
                .mockResolvedValue({ data: { id: 1, foo: 'bar' } }),
        });
        const dataProvider = combineDataProviders(resource => {
            switch (resource) {
                case 'posts':
                    return dataProvider1;
                case 'comments':
                    return dataProvider2;
                default:
                    throw new Error('Unknown resource');
            }
        });
        await dataProvider.getOne('comments', { id: 1 });
        expect(dataProvider1.getOne).not.toHaveBeenCalled();
        expect(dataProvider2.getOne).toHaveBeenCalled();
    });
});
