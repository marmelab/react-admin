import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import expect from 'expect';

import {
    Basic,
    I18N,
    Omit,
    PreferenceKey,
} from './SimpleFormConfigurable.stories';

describe('<SimpleFormConfigurable>', () => {
    const enterConfigurationMode = async () => {
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getAllByDisplayValue('War and Peace')[0]);
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Form');
    };
    it('should render a form with configurable inputs', async () => {
        render(<Basic />);
        await enterConfigurationMode();
        expect(screen.queryByDisplayValue('Leo Tolstoy')).not.toBeNull();
        screen.getAllByLabelText('Author')[0].click();
        expect(screen.queryByDisplayValue('Leo Tolstoy')).toBeNull();
        screen.getAllByLabelText('Author')[0].click();
        expect(screen.queryByDisplayValue('Leo Tolstoy')).not.toBeNull();
    });
    describe('omit', () => {
        it('should not render omitted inputs by default', async () => {
            render(<Omit />);
            expect(screen.queryByLabelText('Author')).toBeNull();
            expect(screen.queryByDisplayValue('Leo Tolstoy')).toBeNull();
            await enterConfigurationMode();
            screen.getByLabelText('Author').click();
            expect(screen.queryByDisplayValue('Leo Tolstoy')).not.toBeNull();
        });
    });
    describe('preferenceKey', () => {
        it('should allow two ConfigurableDatagrid not to share the same preferences', async () => {
            render(<PreferenceKey />);
            expect(screen.queryAllByDisplayValue('War and Peace')).toHaveLength(
                2
            );
            await enterConfigurationMode();
            screen.getAllByLabelText('Title')[0].click();
            expect(screen.queryAllByDisplayValue('War and Peace')).toHaveLength(
                1
            );
        });
    });
    describe('i18n', () => {
        it('should translate the inspector title and buttons with the ra.configurable messages', async () => {
            render(<I18N locale="fr" />);
            screen.getByLabelText('Configurer cette page').click();
            await screen.findByText('Inspecteur');
            fireEvent.mouseOver(
                screen.getAllByDisplayValue('War and Peace')[0]
            );
            await screen.getByTitle('Personnaliser').click();
            await screen.findByText('Formulaire');
            expect(screen.queryByText('Masquer tout')).not.toBeNull();
            expect(screen.queryByText('Afficher tout')).not.toBeNull();
        });
    });
});
