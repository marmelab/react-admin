import { eventChannel } from 'redux-saga';
import realtimeObserver from './realtimeObserver';

export const createSubscribeFactory = realtimeObserverImpl => (watcher, emitter) => {
    const observer = realtimeObserverImpl(emitter);
    const result = watcher.subscribe(observer);

    return result.unsubscribe;
};

export default watcher => eventChannel(emitter => createSubscribeFactory(realtimeObserver)(watcher, emitter));
