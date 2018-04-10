import { END } from 'redux-saga';

import realtimeObserver from './realtimeObserver';

describe('observer', () => {
    const emitter = jest.fn();

    it('calls emitter with END when calling complete', () => {
        realtimeObserver(emitter).complete();

        expect(emitter).toHaveBeenCalledWith(END);
    });

    it('calls emitter with END when calling error', () => {
        realtimeObserver(emitter).error();

        expect(emitter).toHaveBeenCalledWith(END);
    });

    it('calls emitter with value when calling next', () => {
        const expected = 'value';
        realtimeObserver(emitter).next(expected);

        expect(emitter).toHaveBeenCalledWith(expected);
    });
});
