import { Table, styled } from '@mui/material';

const PREFIX = 'RaDatagrid';

export const DatagridClasses = {
    table: `${PREFIX}-table`,
    thead: `${PREFIX}-thead`,
    tbody: `${PREFIX}-tbody`,
    headerRow: `${PREFIX}-headerRow`,
    headerCell: `${PREFIX}-headerCell`,
    checkbox: `${PREFIX}-checkbox`,
    row: `${PREFIX}-row`,
    clickableRow: `${PREFIX}-clickableRow`,
    rowEven: `${PREFIX}-rowEven`,
    rowOdd: `${PREFIX}-rowOdd`,
    rowCell: `${PREFIX}-rowCell`,
    expandHeader: `${PREFIX}-expandHeader`,
    expandIconCell: `${PREFIX}-expandIconCell`,
    expandIcon: `${PREFIX}-expandIcon`,
    expanded: `${PREFIX}-expanded`,
};

export const StyledTable = styled(Table)(({ theme }) => ({
    [`${PREFIX}.${DatagridClasses.table}`]: {
        tableLayout: 'auto',
    },
    [`${PREFIX} .${DatagridClasses.thead}`]: {},
    [`${PREFIX} .${DatagridClasses.tbody}`]: {},
    [`${PREFIX} .${DatagridClasses.headerRow}`]: {},
    [`${PREFIX} .${DatagridClasses.headerCell}`]: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: theme.palette.background.paper,
        '&:first-of-type': {
            borderTopLeftRadius: theme.shape.borderRadius,
        },
        '&:last-child': {
            borderTopRightRadius: theme.shape.borderRadius,
        },
    },
    [`${PREFIX} .${DatagridClasses.checkbox}`]: {},
    [`${PREFIX} .${DatagridClasses.row}`]: {},
    [`${PREFIX} .${DatagridClasses.clickableRow}`]: {
        cursor: 'pointer',
    },
    [`${PREFIX} .${DatagridClasses.rowEven}`]: {},
    [`${PREFIX} .${DatagridClasses.rowOdd}`]: {},
    [`${PREFIX} .${DatagridClasses.rowCell}`]: {},
    [`${PREFIX} .${DatagridClasses.expandHeader}`]: {
        padding: 0,
        width: theme.spacing(6),
    },
    [`${PREFIX} .${DatagridClasses.expandIconCell}`]: {
        width: theme.spacing(6),
    },
    [`${PREFIX} .${DatagridClasses.expandIcon}`]: {
        padding: theme.spacing(1),
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    [`${PREFIX} .${DatagridClasses.expandIcon}.${DatagridClasses.expanded}`]: {
        transform: 'rotate(0deg)',
    },
}));
