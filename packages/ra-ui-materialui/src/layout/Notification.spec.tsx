import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

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
        await screen.findByText('Post deleted');
        expect(deleteOne).toHaveBeenCalledTimes(0);
        await waitFor(() => {
            expect(deleteOne).toHaveBeenCalledTimes(1);
        });
        screen.getByText('ra.action.undo').click();
        expect(deleteOne).toHaveBeenCalledTimes(1);
    });
});
