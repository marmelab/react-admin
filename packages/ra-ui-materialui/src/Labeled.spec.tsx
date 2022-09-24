import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import {
    Basic,
    CustomLabel,
    ExplicitLabel,
    NoLabel,
    NonField,
    NoDoubleLabel,
} from './Labeled.stories';

describe('<Labeled />', () => {
    it('should render the child', () => {
        render(<Basic />);
        screen.getByText('War and Peace');
    });

    it('should render a title based on the resource and source', () => {
        render(<Basic />);
        screen.getByText('Title');
    });

    it('should use custom label in child', () => {
        render(<CustomLabel />);
        screen.getByText('My custom Title');
    });

    it('should use explicit label prop', () => {
        render(<ExplicitLabel />);
        screen.getByText('My custom Title');
    });

    it('should allow to disable label', () => {
        render(<NoLabel />);
        expect(screen.queryByText('Title')).toBeNull();
    });

    it('should render the child even for non-fields', () => {
        render(<NonField />);
        screen.getByText('War and Peace');
    });

    it('should not add label to a Labeled child', () => {
        render(<NoDoubleLabel />);
        expect(screen.queryAllByText('My custom Title')).toHaveLength(1);
    });
});
