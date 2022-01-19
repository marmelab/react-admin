import * as React from 'react';
import { render } from '@testing-library/react';

import DatagridCell from './DatagridCell';

const renderWithTable = element =>
    render(
        <table>
            <tbody>
                <tr>{element}</tr>
            </tbody>
        </table>
    );

describe('<DatagridCell />', () => {
    const Field = () => <div>cell</div>;

    it('should render as a mui <TableCell /> component', () => {
        const { getByRole } = renderWithTable(
            <DatagridCell field={<Field />} />
        );
        expect(getByRole('cell').className).toContain('MuiTableCell-root');
    });
});
