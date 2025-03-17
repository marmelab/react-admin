import { styled } from '@mui/material';

const PREFIX = 'RaDataTable';

export const DataTableClasses = {
    root: `${PREFIX}-root`,
    table: `${PREFIX}-table`,
    tableWrapper: `${PREFIX}-tableWrapper`,
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
    selectable: `${PREFIX}-selectable`,
    expandHeader: `${PREFIX}-expandHeader`,
    expandIconCell: `${PREFIX}-expandIconCell`,
    expandIcon: `${PREFIX}-expandIcon`,
    expandable: `${PREFIX}-expandable`,
    expanded: `${PREFIX}-expanded`,
    expandedPanel: `${PREFIX}-expandedPanel`,
};

export const DataTableRoot = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${DataTableClasses.table}`]: {
        tableLayout: 'auto',
    },
    [`& .${DataTableClasses.tableWrapper}`]: {},
    [`& .${DataTableClasses.thead}`]: {},
    [`& .${DataTableClasses.tbody}`]: {},
    [`& .${DataTableClasses.headerRow}`]: {},
    [`& .${DataTableClasses.headerCell}`]: {
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
    [`& .${DataTableClasses.checkbox}`]: {},
    [`& .${DataTableClasses.row}`]: {},
    [`& .${DataTableClasses.clickableRow}`]: {
        cursor: 'pointer',
    },
    [`& .${DataTableClasses.rowEven}`]: {},
    [`& .${DataTableClasses.rowOdd}`]: {},
    [`& .${DataTableClasses.rowCell}`]: {},
    [`& .${DataTableClasses.expandHeader}`]: {
        paddingRight: 0,
        width: theme.spacing(4),
    },
    [`& .${DataTableClasses.expandIconCell}`]: {
        paddingRight: 0,
        width: theme.spacing(4),
    },
    [`& .${DataTableClasses.expandIcon}`]: {
        padding: theme.spacing(1),
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    [`& .${DataTableClasses.expandIcon}.${DataTableClasses.expanded}`]: {
        transform: 'rotate(0deg)',
    },
    [`& .${DataTableClasses.expandedPanel}`]: {},
}));
