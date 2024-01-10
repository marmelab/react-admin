import { styled } from '@mui/material';

const PREFIX = 'RaDatagrid';

export const DatagridClasses = {
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

export const DatagridRoot = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${DatagridClasses.table}`]: {
        tableLayout: 'auto',
    },
    [`& .${DatagridClasses.tableWrapper}`]: {},
    [`& .${DatagridClasses.thead}`]: {},
    [`& .${DatagridClasses.tbody}`]: {},
    [`& .${DatagridClasses.headerRow}`]: {},
    [`& .${DatagridClasses.headerCell}`]: {
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
    [`& .${DatagridClasses.checkbox}`]: {},
    [`& .${DatagridClasses.row}`]: {},
    [`& .${DatagridClasses.clickableRow}`]: {
        cursor: 'pointer',
    },
    [`& .${DatagridClasses.rowEven}`]: {},
    [`& .${DatagridClasses.rowOdd}`]: {},
    [`& .${DatagridClasses.rowCell}`]: {},
    [`& .${DatagridClasses.expandHeader}`]: {
        padding: 0,
        width: theme.spacing(6),
    },
    [`& .${DatagridClasses.expandIconCell}`]: {
        width: theme.spacing(6),
    },
    [`& .${DatagridClasses.expandIcon}`]: {
        padding: theme.spacing(1),
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    [`& .${DatagridClasses.expandIcon}.${DatagridClasses.expanded}`]: {
        transform: 'rotate(0deg)',
    },
    [`& .${DatagridClasses.expandedPanel}`]: {},
}));
