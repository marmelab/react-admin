import * as React from 'react';
import {
    render,
    fireEvent,
    screen,
    waitFor,
    act,
} from '@testing-library/react';
import { ListsWithAccessControl } from './useListController.accessControl.stories';

describe('useListController', () => {
    it('should display the list only when access is granted to the resource', async () => {
        const exporter = jest.fn();
        render(<ListsWithAccessControl exporter={exporter} />);

        expect(screen.queryByText('Post #1 - 90 votes')).toBeNull();
        expect(screen.getByLabelText('posts access')).not.toBeChecked();
        fireEvent.click(screen.getByLabelText('posts access'));

        await waitFor(() => {
            expect(screen.queryByText('Post #1 - 90 votes')).not.toBeNull();
        });
    });

    it('should export fields for which access is granted', async () => {
        const exporter = jest.fn();
        render(
            <ListsWithAccessControl
                initialAuthorizedResources={{
                    posts: true,
                    'posts.id': true,
                    'posts.title': true,
                    'posts.votes': true,
                }}
                exporter={exporter}
            />
        );

        await waitFor(() => {
            expect(screen.queryByText('Post #1 - 90 votes')).not.toBeNull();
        });

        act(() => {
            fireEvent.click(screen.getByLabelText('export'));
        });
        await waitFor(() => {
            expect(exporter).toBeCalledTimes(1);
        });
        expect(exporter).toBeCalledWith(
            [
                {
                    id: 1,
                    title: 'Post #1',
                    votes: 90,
                },
                {
                    id: 2,
                    title: 'Post #2',
                    votes: 20,
                },
                {
                    id: 3,
                    title: 'Post #3',
                    votes: 30,
                },
                {
                    id: 4,
                    title: 'Post #4',
                    votes: 40,
                },
                {
                    id: 5,
                    title: 'Post #5',
                    votes: 50,
                },
            ],
            null,
            null,
            'posts'
        );

        act(() => {
            fireEvent.click(screen.getByLabelText('posts.id access'));
        });
        await waitFor(() => {
            expect(screen.getByLabelText('posts.id access')).not.toBeChecked();
        });

        await waitFor(() => {
            expect(screen.queryByText('Post #1 - 90 votes')).not.toBeNull();
        });

        act(() => {
            fireEvent.click(screen.getByLabelText('export'));
        });
        await waitFor(() => {
            expect(exporter).toBeCalledTimes(2);
        });
        expect(exporter).toBeCalledWith(
            [
                {
                    id: 1,
                    title: 'Post #1',
                    votes: 90,
                },
                {
                    id: 2,
                    title: 'Post #2',
                    votes: 20,
                },
                {
                    id: 3,
                    title: 'Post #3',
                    votes: 30,
                },
                {
                    id: 4,
                    title: 'Post #4',
                    votes: 40,
                },
                {
                    id: 5,
                    title: 'Post #5',
                    votes: 50,
                },
            ],
            null,
            null,
            'posts'
        );
    });
});
