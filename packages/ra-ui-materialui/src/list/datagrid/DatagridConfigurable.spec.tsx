import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';

import { Basic } from './DatagridConfigurable.stories';

describe('<DatagridConfigurable>', () => {
    it('should render a datagrid with a configurable columns', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        await screen.getAllByTitle('ra.configurable.customize')[0].click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('1869')).not.toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).not.toBeNull();
    });
    it('should accept fields with a custom title', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        await screen.getAllByTitle('ra.configurable.customize')[0].click();
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
        await screen.getAllByTitle('ra.configurable.customize')[0].click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
        screen.getByLabelText('Author').click();
        expect(screen.queryByText('Leo Tolstoy')).toBeNull();
        screen.getByLabelText('Author').click();
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
    });
});
