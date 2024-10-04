import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    AccessControl,
    AccessControlInsideAdminChildFunction,
    Basic,
    InsideAdminChildFunction,
} from './ResourceMenuItem.stories';

describe('ResourceMenuItem', () => {
    it('should not throw when used with only <Resource> as <Admin> child', async () => {
        render(<Basic />);
    });
    it('should not throw when used with a Function as <Admin> child', async () => {
        render(<InsideAdminChildFunction />);
    });
    it('should not render when authProvider.canAccess returns false', async () => {
        render(<AccessControl />);
        await screen.findByText('resources.posts.name');
        expect(screen.queryByText('resources.users.name')).toBeNull();
    });
    it('should not render when authProvider.canAccess returns false with a Function as <Admin> child', async () => {
        render(<AccessControlInsideAdminChildFunction />);
        await screen.findByText('resources.posts.name');
        expect(screen.queryByText('resources.users.name')).toBeNull();
    });
});
