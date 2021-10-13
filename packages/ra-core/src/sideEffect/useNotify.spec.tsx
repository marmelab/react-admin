import * as React from 'react';
import { useEffect } from 'react';
import { renderWithRedux } from 'ra-test';
import { useNotify } from './index';

const Notification = ({
    type,
    message,
    undoable = false,
    autoHideDuration = 4000,
    multiLine = true,
    shortSignature = false,
}) => {
    const notify = useNotify();
    useEffect(() => {
        if (shortSignature) {
            // @ts-ignore
            notify(message, {
                type,
                undoable,
                autoHideDuration,
                multiLine,
            });
        } else {
            notify(message, type, {}, undoable, autoHideDuration, multiLine);
        }
    }, [message, undoable, autoHideDuration, multiLine, notify]);
    return null;
};

describe('useNotify', () => {
    it('should show a multiline notification message', () => {
        const { dispatch } = renderWithRedux(
            <Notification
                type="info"
                message={`One Line\nTwo Lines\nThree Lines`}
                multiLine
            />
        );

        expect(dispatch).toHaveBeenCalledTimes(1);
    });
});
