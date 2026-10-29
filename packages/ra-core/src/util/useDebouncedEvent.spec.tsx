import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { useDebouncedEvent } from './useDebouncedEvent';

const DebouncedButtons = ({
    cb,
    delay = 300,
}: {
    cb: (value: string) => void;
    delay?: number;
}) => {
    const update = useDebouncedEvent(cb, delay);
    return (
        <>
            <button onClick={() => update('x')}>update</button>
            <button onClick={() => update.cancel()}>cancel</button>
            <button onClick={() => update.flush()}>flush</button>
        </>
    );
};

describe('useDebouncedEvent', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('calls the callback after the delay', () => {
        const cb = jest.fn();
        render(<DebouncedButtons cb={cb} />);
        fireEvent.click(screen.getByText('update'));
        expect(cb).not.toHaveBeenCalled();
        act(() => jest.advanceTimersByTime(300));
        expect(cb).toHaveBeenCalledWith('x');
    });
    it('cancels a pending call with cancel()', () => {
        const cb = jest.fn();
        render(<DebouncedButtons cb={cb} />);
        fireEvent.click(screen.getByText('update'));
        fireEvent.click(screen.getByText('cancel'));
        act(() => jest.advanceTimersByTime(300));
        expect(cb).not.toHaveBeenCalled();
    });
    it('runs a pending call immediately with flush()', () => {
        const cb = jest.fn();
        render(<DebouncedButtons cb={cb} />);
        fireEvent.click(screen.getByText('update'));
        fireEvent.click(screen.getByText('flush'));
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('x');
        act(() => jest.advanceTimersByTime(300));
        expect(cb).toHaveBeenCalledTimes(1);
    });
    it('flushes a pending call on unmount', () => {
        const cb = jest.fn();
        const { unmount } = render(<DebouncedButtons cb={cb} />);
        fireEvent.click(screen.getByText('update'));
        unmount();
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('x');
        act(() => jest.advanceTimersByTime(300));
        expect(cb).toHaveBeenCalledTimes(1);
    });
    it('flushes a pending call when the delay changes', () => {
        const cb = jest.fn();
        const { rerender } = render(<DebouncedButtons cb={cb} />);
        fireEvent.click(screen.getByText('update'));
        rerender(<DebouncedButtons cb={cb} delay={500} />);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('x');
        act(() => jest.advanceTimersByTime(500));
        expect(cb).toHaveBeenCalledTimes(1);
    });
});
