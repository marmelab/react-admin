import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { PageTitle } from './PageTitle';
import {
    Basic,
    DefaultTitle,
    ElementTitle,
    TitleFromPreferences,
} from './PageTitle.stories';

describe('<PageTitle>', () => {
    it('should set the document title from the title and the app title', () => {
        render(<Basic />);
        expect(document.title).toBe('Books - Book Store');
    });

    it('should fall back to the default title', () => {
        render(<DefaultTitle />);
        expect(document.title).toBe('Books - Book Store');
    });

    it('should not repeat the app title', () => {
        render(<DefaultTitle defaultTitle="Book Store" />);
        expect(document.title).toBe('Book Store');
    });

    it('should not set the document title when the title is an element', () => {
        render(<ElementTitle />);
        expect(document.title).toBe('');
    });

    it('should not set the document title when the app title is empty', () => {
        render(<Basic appTitle="" />);
        expect(document.title).toBe('');
    });

    it('should not set the document title when the app title is not set', () => {
        render(<PageTitle title="Books" />);
        expect(document.title).toBe('');
    });

    it('should set the document title when the app title is React Admin', () => {
        render(<Basic appTitle="React Admin" />);
        expect(document.title).toBe('Books - React Admin');
    });

    it('should use the title from preferences', async () => {
        render(<TitleFromPreferences />);
        await screen.findByText('My Books');
        expect(document.title).toBe('My Books - Book Store');
    });
});
