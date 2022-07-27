import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RecordRepresentation, Basic } from './ReferenceOneField.stories';

describe('ReferenceOneField', () => {
    it('should render the recordRepresentation of the related record', async () => {
        render(<RecordRepresentation />);
        await screen.findByText('Genre: novel, ISBN: 9780393966473');
    });
    it('should render its child in the context of the related record', async () => {
        render(<Basic />);
        await screen.findByText('9780393966473');
    });
});
