import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    AccessControl,
    InferredWithoutAuthProviderWithBothShowAndEditView,
    InferredWithoutAuthProviderWithEditViewOnly,
    InferredWithoutAuthProviderWithShowViewOnly,
    LinkSpecifiedWithoutAuthProvider,
} from './useGetPathForRecordCallback.stories';

describe('useGetPathForRecordCallback', () => {
    it('should infer a show path for a record when there is no authProvider and no edit view', async () => {
        render(<InferredWithoutAuthProviderWithBothShowAndEditView />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book show');
        await screen.findByText('Title: War and Peace');
    });
    it('should infer a show path for a record when there is no authProvider and both a show and an edit view', async () => {
        render(<InferredWithoutAuthProviderWithShowViewOnly />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book show');
        await screen.findByText('Title: War and Peace');
    });
    it('should infer an edit path for a record when there is no authProvider and no show view', async () => {
        render(<InferredWithoutAuthProviderWithEditViewOnly />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book edit');
        await screen.findByText('Title: War and Peace');
    });
    it('should return a show path for a record when the link type is show', async () => {
        render(<LinkSpecifiedWithoutAuthProvider link="show" />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book show');
        await screen.findByText('Title: War and Peace');
    });
    it('should return an edit path for a record when the link type is edit', async () => {
        render(<LinkSpecifiedWithoutAuthProvider link="edit" />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book edit');
        await screen.findByText('Title: War and Peace');
    });
    it('should infer a show path for a record when users have access to it', async () => {
        render(<AccessControl canAccessShow />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book show');
        await screen.findByText('Title: War and Peace');
    });
    it('should infer an edit path for a record when users have access to edit but not show', async () => {
        render(<AccessControl canAccessShow={false} canAccessEdit />);
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Book edit');
        await screen.findByText('Title: War and Peace');
    });
    it('should return a show path for a record even though users do not have access to it if specified', async () => {
        render(
            <AccessControl
                link="show"
                canAccessShow={false}
                canAccessEdit={false}
            />
        );
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Access denied');
    });
    it('should return an edit path for a record even though users do not have access to it if specified', async () => {
        render(
            <AccessControl
                link="edit"
                canAccessShow={false}
                canAccessEdit={false}
            />
        );
        fireEvent.click(await screen.findByText('War and Peace'));
        await screen.findByText('Access denied');
    });
});
