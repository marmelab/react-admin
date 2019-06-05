import { createSubscribeFactory } from './createObserverChannel';

describe('createObserverChannel', () => {
    const unsubscribe = jest.fn();
    const queryObserver = jest.fn(() => ({}));
    const emitter = 'the emitter';
    const watcher = {
        subscribe: jest.fn(() => ({ unsubscribe })),
    };

    const unsubscribeWatcher = createSubscribeFactory(queryObserver)(watcher, 'the emitter');
    it('calls the queryObserver with the specified emitter', () => {
        expect(queryObserver).toHaveBeenCalledWith(emitter);
    });

    it('calls subscribe on the watcher', () => {
        expect(watcher.subscribe).toHaveBeenCalled();
    });

    it('returns an unsubscribe function', () => {
        unsubscribeWatcher();
        expect(unsubscribe).toHaveBeenCalled();
    });
});
