import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Expand } from './Datagrid.stories';

describe('ExpandAllButton', () => {
    it('should expand all rows at once', async () => {
        const rendered = render(<Expand />);
        const button = rendered.container.querySelector(
            '.RaDatagrid-expandHeader>div'
        );
        const expectExpandedRows = (count: number) => {
            expect(
                rendered.container.querySelectorAll('.RaDatagrid-expandedPanel')
            ).toHaveLength(count);
        };

        expect(button).not.toBe(null);

        expectExpandedRows(0);

        fireEvent.click(button);
        expectExpandedRows(4);

        fireEvent.click(button);
        expectExpandedRows(0);
    });
});
