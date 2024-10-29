import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { ConsecutiveUndoable } from './Notification.stories';

describe('<Notification />', () => {
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
});
