import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Expand } from './Datagrid.stories';

describe('Expand', () => {
    it('should render the recordRepresentation of the related record', async () => {
        const rendered = render(<Expand />);
        const button = rendered.container.querySelector(
            '.RaDatagrid-expandHeader>div'
        );

        expect(button).not.toBe(null);

        expect(
            rendered.container.querySelectorAll('.RaDatagrid-expandedPanel')
        ).toHaveLength(0);
        fireEvent.click(button);

        expect(
            rendered.container.querySelectorAll('.RaDatagrid-expandedPanel')
        ).toHaveLength(4);
    });
});
