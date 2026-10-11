import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useDebouncedEvent } from './useDebouncedEvent';

const Comp = ({ cb, cancelOnClick = false }: any) => {
    const update = useDebouncedEvent(cb, 300);
    return (
        <button
            onClick={() => (cancelOnClick ? update.cancel() : update('x'))}
        >
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
        screen.getByText('go').click();
        act(() => jest.advanceTimersByTime(300));
        expect(cb).toHaveBeenCalledWith('x');
    });
    it('cancels a pending call with cancel()', () => {
        const cb = jest.fn();
        const { rerender } = render(<Comp cb={cb} />);
        screen.getByText('go').click();
        rerender(<Comp cb={cb} cancelOnClick />);
        screen.getByText('go').click();
        act(() => jest.advanceTimersByTime(300));
        expect(cb).not.toHaveBeenCalled();
    });
    it('cancels a pending call on unmount', () => {
        const cb = jest.fn();
        const { unmount } = render(<Comp cb={cb} />);
        screen.getByText('go').click();
        unmount();
        act(() => jest.advanceTimersByTime(300));
        expect(cb).not.toHaveBeenCalled();
    });
});
