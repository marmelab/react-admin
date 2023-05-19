import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import expect from 'expect';

import {
    Basic,
    Omit,
    PreferenceKey,
    LabelElement,
    NullChildren,
} from './DatagridConfigurable.stories';

describe('<DatagridConfigurable>', () => {
    it('should render a datagrid with configurable columns', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('1869')).not.toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).not.toBeNull();
    });
    it('should accept fields with a custom label', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });
    it('should accept fields with a label element', async () => {
        render(<LabelElement />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        screen.getByLabelText('Title').click();
        expect(screen.queryByText('War and Peace')).toBeNull();
        screen.getByLabelText('Title').click();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });
    it('accepts null children', async () => {
        render(<NullChildren />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });
    it('should accept fields with no source', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
        screen.getByLabelText('Author').click();
        expect(screen.queryByText('Leo Tolstoy')).toBeNull();
        screen.getByLabelText('Author').click();
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
    });
    describe('omit', () => {
        it('should not render omitted columns by default', async () => {
            render(<Omit />);
            expect(screen.queryByText('Original title')).toBeNull();
            expect(screen.queryByText('War and Peace')).toBeNull();
            screen.getByLabelText('Configure mode').click();
            await screen.findByText('Inspector');
            fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
            await screen.getByTitle('ra.configurable.customize').click();
            await screen.findByText('Datagrid');
            screen.getByLabelText('Original title').click();
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });
    describe('preferenceKey', () => {
        it('should allow two ConfigurableDatagrid not to share the same preferences', async () => {
            render(<PreferenceKey />);
            expect(screen.queryAllByText('War and Peace')).toHaveLength(2);
            screen.getByLabelText('Configure mode').click();
            await screen.findByText('Inspector');
            fireEvent.mouseOver(screen.getAllByText('Leo Tolstoy')[0]);
            await screen.getByTitle('ra.configurable.customize').click();
            await screen.findByText('Datagrid');
            screen.getByLabelText('Original title').click();
            expect(screen.queryAllByText('War and Peace')).toHaveLength(1);
        });
    });
});
