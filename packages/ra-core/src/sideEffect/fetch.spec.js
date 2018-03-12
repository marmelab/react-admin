import { handleFetch } from './fetch';
import { CRUD_GET_ONE } from '../actions/dataActions';

describe('fetch saga', () => {
    const dataProvider = jest.fn();
    let next;

    it('should select the optimistic status if ignoreOptimistic is false', () => {
        next = handleFetch(dataProvider, {
            meta: { ignoreOptimistic: false },
        }).next();
        expect(next.value).toHaveProperty('SELECT');
    });
    it('should skip select optimistic status if ignoreOptimistic is true', () => {
        next = handleFetch(dataProvider, {
            type: CRUD_GET_ONE,
            meta: { ignoreOptimistic: true },
        }).next();
        expect(next.value).toEqual(false);
    });
});
