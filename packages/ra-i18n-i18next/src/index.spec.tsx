import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Basic,
    WithCustomTranslations,
    WithCustomOptions,
    WithLazyLoadedLanguages,
} from './index.stories';

describe('i18next i18nProvider', () => {
    test('should work with no configuration except the messages', async () => {
        render(<Basic />);

        await screen.findByText('Comments');
        await screen.findByText('Export');
        expect(await screen.findAllByText('Posts')).toHaveLength(2);

        // Check interpolation
        await screen.findByText('1-1 of 1');
        fireEvent.click(await screen.findByText('Lorem Ipsum'));
        // Check singularization
        await screen.findByText('Post #1');
    });

    test('should work with custom interpolation options', async () => {
        render(<WithLazyLoadedLanguages />);

        await screen.findByText('Export');

        // Check interpolation
        await screen.findByText('1-1 of 1');
        fireEvent.click(
            await screen.findByText('English', { selector: 'button' })
        );
        fireEvent.click(await screen.findByText('French'));
        await screen.findByText('Exporter');
    });

    test('should work with custom translations', async () => {
        render(<WithCustomTranslations />);

        await screen.findByText('Comments');
        await screen.findByText('Export');
        expect(await screen.findAllByText('Blog posts')).toHaveLength(2);

        // Check interpolation
        await screen.findByText('1-1 of 1');
        fireEvent.click(await screen.findByText('Lorem Ipsum'));
        // Check singularization
        await screen.findByText('Blog post #1');
    });

    test('should work with multiple languages', async () => {
        render(<WithCustomTranslations />);

        await screen.findByText('Comments');
        await screen.findByText('Export');
        expect(await screen.findAllByText('Blog posts')).toHaveLength(2);

        // Check interpolation
        await screen.findByText('1-1 of 1');
        fireEvent.click(await screen.findByText('Lorem Ipsum'));
        // Check singularization
        await screen.findByText('Blog post #1');
    });
});
