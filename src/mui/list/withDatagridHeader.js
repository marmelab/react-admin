import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridCell from './DatagridCell';

const hoc = FieldComponent =>
    branch(
        ({ context }) => context === 'datagridHeader',
        renderComponent(DatagridHeaderCell)
    )(
        branch(
            ({ context }) => context === 'datagridCell',
            renderComponent(DatagridCell)
        )(FieldComponent)
    );

export default hoc;
