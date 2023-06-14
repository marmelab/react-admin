import { asyncDebounce } from './asyncDebounce';

describe('asyncDebounce', () => {
    it('should return a debounced function that returns a promise resolving once the delay is passed', async () => {
        const func = jest.fn(value => Promise.resolve(value));
        const debounced = asyncDebounce(func, 100);

        const promise1 = debounced('not expected');
        const promise2 = debounced('not expected');
        const promise3 = debounced('expected');

        expect(func).not.toHaveBeenCalled();

        await new Promise(resolve => setTimeout(resolve, 110));

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).not.toHaveBeenCalledWith('not expected');
        expect(func).toHaveBeenCalledWith('expected');
        expect(promise1).resolves.toBe('expected');
        expect(promise2).resolves.toBe('expected');
        expect(promise3).resolves.toBe('expected');
    });

    it('should return a debounced function that allow multiple calls after the delay', async () => {
        const func = jest.fn(value => Promise.resolve(value));
        const debounced = asyncDebounce(func, 100);

        const promise1 = debounced('not expected');
        const promise2 = debounced('not expected');
        const promise3 = debounced('expected');

        expect(func).not.toHaveBeenCalled();
        await new Promise(resolve => setTimeout(resolve, 110));
        const promise4 = debounced('not expected new');
        const promise5 = debounced('not expected new');
        const promise6 = debounced('expected new');

        await new Promise(resolve => setTimeout(resolve, 110));

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).not.toHaveBeenCalledWith('not expected');
        expect(func).toHaveBeenCalledWith('expected');
        expect(promise1).resolves.toBe('expected');
        expect(promise2).resolves.toBe('expected');
        expect(promise3).resolves.toBe('expected');
        expect(promise4).resolves.toBe('expected new');
        expect(promise5).resolves.toBe('expected new');
        expect(promise6).resolves.toBe('expected new');
    });
});
