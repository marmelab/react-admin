import { eventChannel } from 'redux-saga';
import queryObserver from './queryObserver';

export const createSubscribeFactory = queryObserverImpl => (
    watcher,
    emitter,
) => {
    const observer = queryObserverImpl(emitter);
    const result = watcher.subscribe(observer);

    return result.unsubscribe;
};

export default watcher =>
    eventChannel(emitter =>
        createSubscribeFactory(queryObserver)(watcher, emitter),
    );
