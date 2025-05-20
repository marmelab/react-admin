import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import {
    Basic,
    Source,
    Label,
    Empty,
    Render,
    Field,
    Children,
} from './RecordField.stories';
export default {
    title: 'ra-ui-materialui/fields/RecordField',
};

describe('<RecordField />', () => {
    describe('source', () => {
        it('should render the source field from the record in context', () => {
            render(<Basic />);
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
        it('should render nothing when the source is not found', () => {
            render(<Source />);
            expect(screen.queryByText('Missing field')).not.toBeNull();
        });
        it('should support paths with dots', () => {
            render(<Source />);
            expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
        });
    });
    describe('label', () => {
        it('should render the humanized source as label by default', () => {
            render(<Basic />);
            expect(screen.queryByText('Title')).not.toBeNull();
        });
        it('should render the label prop as label', () => {
            render(<Label />);
            expect(screen.queryByText('Identifier')).not.toBeNull();
        });
        it('should render no label when label is false', () => {
            render(<Label />);
            expect(screen.queryByText('Summary')).toBeNull();
        });
    });
    describe('empty', () => {
        it('should render the translated empty when the record is undefined', () => {
            render(<Empty />);
            expect(screen.queryByText('No title')).not.toBeNull();
        });
        it('should render the translated empty when using a render prop', () => {
            render(<Empty />);
            expect(screen.queryByText('Unknown author')).not.toBeNull();
        });
        it('should render the translated empty when using a field prop', () => {
            render(<Empty />);
            expect(screen.queryByText('0')).not.toBeNull();
        });
    });
    describe('render', () => {
        it('should render the value using the render prop', () => {
            render(<Render />);
            expect(screen.queryByText('WAR AND PEACE')).not.toBeNull();
        });
        it('should allow to render a React element', () => {
            render(<Render />);
            expect(screen.queryByText('LEO TOLSTOY')).not.toBeNull();
        });
        it('should not fail when the record is undefined', () => {
            render(<Render />);
            expect(screen.queryByText('Summary')).not.toBeNull();
        });
    });
    describe('field', () => {
        it('should use the field component to render the field', () => {
            render(<Field />);
            expect(screen.queryByText('1,869')).not.toBeNull();
        });
    });
    describe('children', () => {
        it('should render the field using the children rather than a TextField', () => {
            render(<Children />);
            expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
            expect(screen.queryByText('(DECD)')).not.toBeNull();
        });
    });
});
