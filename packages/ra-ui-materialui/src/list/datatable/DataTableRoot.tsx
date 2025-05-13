import { type ComponentsOverrides, styled } from '@mui/material';
import type { DataTableProps } from './DataTable';

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
    expandRow: `${PREFIX}-expandRow`,
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
        backgroundColor: (theme.vars || theme).palette.background.paper,
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
    [`& .${DataTableClasses.expandable} > td`]: {
        borderBottom: 'unset',
    },
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
            duration: theme.transitions.duration.short,
        }),
    },
    [`& .${DataTableClasses.expandIcon}.${DataTableClasses.expanded}`]: {
        transform: 'rotate(0deg)',
    },
    [`& .${DataTableClasses.expandRow}`]: {},
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaDataTable:
            | 'root'
            | 'table'
            | 'tableWrapper'
            | 'thead'
            | 'tbody'
            | 'headerRow'
            | 'headerCell'
            | 'checkbox'
            | 'row'
            | 'clickableRow'
            | 'rowEven'
            | 'rowOdd'
            | 'rowCell'
            | 'selectable'
            | 'expandHeader'
            | 'expandIconCell'
            | 'expandIcon'
            | 'expandable'
            | 'expanded'
            | 'expandRow';
    }

    interface ComponentsPropsList {
        RaDataTable: Partial<DataTableProps>;
    }

    interface Components {
        RaDataTable?: {
            defaultProps?: ComponentsPropsList['RaDataTable'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaDataTable'];
        };
    }
}
