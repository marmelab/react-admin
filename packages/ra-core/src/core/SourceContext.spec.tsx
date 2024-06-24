import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Basic, WithoutSourceContext } from './SourceContext.stories';

describe('SourceContext', () => {
    it('should read SourceContext inside from a Form', () => {
        render(<Basic />);
        screen.getByLabelText('Book');
        expect(screen.getByRole('textbox').getAttribute('name')).toEqual(
            'book'
        );
    });

    it('should read default SourceContext if not provided', () => {
        render(<WithoutSourceContext />);
        screen.getByLabelText('Book');
        expect(screen.getByRole('textbox').getAttribute('name')).toEqual(
            'book'
        );
    });
});
