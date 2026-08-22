import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

let mockMuiMajor = 5;

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    const ReactModule = jest.requireActual('react') as typeof React;
    const Mui6Snackbar = ReactModule.forwardRef<any, any>((props, ref) => {
        const wasOpen = ReactModule.useRef(props.open);

        ReactModule.useEffect(() => {
            if (wasOpen.current && !props.open) {
                props.slotProps?.transition?.onExited?.(null);
                props.TransitionProps?.onExited?.(null);
            }
            wasOpen.current = props.open;
        }, [props.open, props.slotProps, props.TransitionProps]);

        ReactModule.useEffect(() => {
            if (!props.open) return;

            document.addEventListener('click', props.onClose);
            return () => document.removeEventListener('click', props.onClose);
        }, [props.open, props.onClose]);

        if (!props.open) return null;

        return ReactModule.createElement(
            'div',
            { ref },
            props.children ?? props.message,
            props.action,
            ReactModule.createElement(
                'button',
                { onClick: props.onClose },
                'Close notification'
            )
        );
    });
    const Snackbar = ReactModule.forwardRef<any, any>((props, ref) =>
        mockMuiMajor >= 6
            ? ReactModule.createElement(Mui6Snackbar, { ...props, ref })
            : ReactModule.createElement(actual.Snackbar, { ...props, ref })
    );

    return {
        ...actual,
        major: { valueOf: () => mockMuiMajor },
        Snackbar,
    };
});

import {
    ConsecutiveNotifications,
    ConsecutiveUndoable,
    CustomNotificationWithAction,
} from './Notification.stories';

describe('<Notification />', () => {
    afterEach(() => {
        mockMuiMajor = 5;
    });

    it.each([6, 7, 9])(
        'should confirm an undoable mutation once when the notification exits with MUI %s',
        async muiMajor => {
            mockMuiMajor = muiMajor;
            const deleteOne = jest
                .fn()
                .mockImplementation((_resource, { id }) =>
                    Promise.resolve({ data: { id } })
                );
            const dataProvider = { delete: deleteOne } as any;
            render(<ConsecutiveUndoable dataProvider={dataProvider} />);

            (await screen.findByText('Delete post 1')).click();
            await screen.findByText('Post 1 deleted');

            fireEvent.click(
                screen.getByRole('button', { name: 'Close notification' })
            );

            await waitFor(() => expect(deleteOne).toHaveBeenCalled());
            expect(deleteOne).toHaveBeenCalledTimes(1);
        }
    );

    it('should confirm the first undoable notification when a second one starts', async () => {
        const deleteOne = jest
            .fn()
            .mockImplementation((_resource, { id }) =>
                Promise.resolve({ data: { id } })
            );
        const dataProvider = { delete: deleteOne } as any;
        render(<ConsecutiveUndoable dataProvider={dataProvider} />);
        (await screen.findByText('Delete post 1')).click();

        // the notification shows up
        await screen.findByText('Post 1 deleted');
        // but the delete hasn't been called yet
        expect(deleteOne).toHaveBeenCalledTimes(0);

        screen.getByText('Delete post 2').click();

        // the second notification shows up
        await screen.findByText('Post 2 deleted');
        // the first delete has been called
        expect(deleteOne).toHaveBeenCalledTimes(1);

        screen.getByText('ra.action.undo').click();
        // the second delete hasn't been called
        expect(deleteOne).toHaveBeenCalledTimes(1);
    });
    it('allows custom notifications to close themselves', async () => {
        const consoleLog = jest.spyOn(console, 'log').mockImplementation();
        render(<CustomNotificationWithAction />);
        await screen.findByText('Applied automatic changes');
        screen.getByText('Cancel').click();
        await waitFor(() => {
            expect(screen.queryByText('Applied automatic changes')).toBeNull();
        });
        expect(consoleLog).toHaveBeenCalledWith('Custom action');
    });
    it('should display consecutive notifications', async () => {
        const { container } = render(<ConsecutiveNotifications />);
        await screen.findByText('hello, world');
        // This line ensures the test fails without the fix
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(screen.queryByText('goodbye, world')).toBeNull();
        fireEvent.click(container);
        await screen.findByText('goodbye, world');
    });
});
