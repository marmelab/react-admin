import assert from 'assert';
import React from 'react';
import PropTypes from 'prop-types';
import { render, cleanup } from '@testing-library/react';

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
    const Field = ({ basePath }) => <div>{basePath}</div>;
    Field.propTypes = {
        type: PropTypes.string,
        basePath: PropTypes.string,
    };

    Field.defaultProps = {
        type: 'foo',
    };

    it('should render as a mui <TableCell /> component', () => {
        const { getByRole } = renderWithTable(
            <DatagridCell field={<Field />} />
        );
        assert.equal(getByRole('cell').className, 'MuiTableCell-root');
    });

    it('should pass the Datagrid basePath by default', () => {
        const { queryByText } = renderWithTable(
            <DatagridCell basePath="default" field={<Field />} />
        );
        assert.notEqual(queryByText('default'), null);
    });

    it('should allow to overwrite the `basePath` field', () => {
        const { queryByText } = renderWithTable(
            <DatagridCell basePath="default" field={<Field basePath="new" />} />
        );
        assert.notEqual(queryByText('new'), null);
    });
});
