import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { useDebouncedEvent } from './useDebouncedEvent';

const Comp = ({ cb, cancelOnClick = false, delay = 300 }: any) => {
    const update = useDebouncedEvent(cb, delay);
    return (
        <button onClick={() => (cancelOnClick ? update.cancel() : update('x'))}>
            go
        </button>
    );
};

describe('useDebouncedEvent', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('calls the callback after the delay', () => {
        const cb = jest.fn();
        render(<Comp cb={cb} />);
        fireEvent.click(screen.getByText('go'));
        act(() => jest.advanceTimersByTime(300));
        expect(cb).toHaveBeenCalledWith('x');
    });
    it('cancels a pending call with cancel()', () => {
        const cb = jest.fn();
        const { rerender } = render(<Comp cb={cb} />);
        fireEvent.click(screen.getByText('go'));
        rerender(<Comp cb={cb} cancelOnClick />);
        fireEvent.click(screen.getByText('go'));
        act(() => jest.advanceTimersByTime(300));
        expect(cb).not.toHaveBeenCalled();
    });
    it('flushes a pending call on unmount', () => {
        const cb = jest.fn();
        const { unmount } = render(<Comp cb={cb} />);
        fireEvent.click(screen.getByText('go'));
        unmount();
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('x');
        act(() => jest.advanceTimersByTime(300));
        expect(cb).toHaveBeenCalledTimes(1);
    });
    it('flushes a pending call when the delay changes', () => {
        const cb = jest.fn();
        const { rerender } = render(<Comp cb={cb} />);
        fireEvent.click(screen.getByText('go'));
        rerender(<Comp cb={cb} delay={500} />);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('x');
        act(() => jest.advanceTimersByTime(500));
        expect(cb).toHaveBeenCalledTimes(1);
    });
});
