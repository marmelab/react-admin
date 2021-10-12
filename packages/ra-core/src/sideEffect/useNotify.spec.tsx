import * as React from 'react';
import { useEffect } from 'react';
import { renderWithRedux } from 'ra-test';
import { useNotify } from './index';

const Notification = ({
    message,
    undoable = false,
    autoHideDuration = 4000,
    multiLine = true,
}) => {
    const notify = useNotify();
    useEffect(() => {
        notify(message, 'info', {}, undoable, autoHideDuration, multiLine);
    }, [message, undoable, autoHideDuration, multiLine, notify]);
    return null;
};

describe('useNotify', () => {
    it('should show a multiline notification message', () => {
        const { dispatch } = renderWithRedux(
            <Notification
                message={`One Line\nTwo Lines\nThree Lines`}
                multiLine
            />
        );

        expect(dispatch).toHaveBeenCalledTimes(1);
    });
});
