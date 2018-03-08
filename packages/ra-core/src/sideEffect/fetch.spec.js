import { cancel, fork, take } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';

import crudFetch, { handleFetch, takeFetchAction } from './fetch';

describe('fetch saga', () => {
    const dataProvider = jest.fn();
    const action = {
        meta: { fetch: 'FETCH_ONE', resource: 'test', cancelPrevious: true },
    };

    const saga = crudFetch(dataProvider);
    const generator = saga();

    it('waits for a fetch action', () => {
        expect(generator.next().value).toEqual(take(takeFetchAction));
    });

    it('should select the optimistic status', () => {
        expect(generator.next(action).value).toHaveProperty('SELECT');
    });
    it('should fork a handleFetch', () => {
        expect(generator.next(false).value).toEqual(
            fork(handleFetch, dataProvider, action)
        );
    });
    const task = createMockTask();
    it('waits for another fetch action', () => {
        expect(generator.next(task).value).toEqual(take(takeFetchAction));
    });
    it('should select the optimistic status', () => {
        expect(generator.next(action).value).toHaveProperty('SELECT');
    });
    it('should cancel previous task of same resource', () => {
        expect(generator.next(false).value).toEqual(cancel(task));
    });
});
