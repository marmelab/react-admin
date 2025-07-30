import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { I18n, I18nResourceSpecific } from './Offline.stories';

describe('<Offline>', () => {
    it('should render the default message', async () => {
        render(<I18n />);
        await screen.findByText('No connectivity. Could not fetch data.');
    });
    it('should render the resource specific message', async () => {
        render(<I18nResourceSpecific />);
        await screen.findByText('No connectivity. Could not fetch posts.');
    });
});
