import * as React from 'react';
import { FC } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useListContext, useTranslate } from 'ra-core';

/**
 * A button allowing to change the sort field and order.
 *
 * To be used inside a ListContext (e.g. inside a <List> or <ReferenceManyfield>)
 *
 * Expects one 'fields' prop, containing an array of field strings that shall
 * be used and displayed for sorting.
 *
 * When users clicks on the <SortButton>, they see a dropdown list with the
 * proposed sorting fields. Once they click on one of these fields, the related
 * list refreshes, re-sorted.
 *
 * @example
 *
 * import * as React from 'react';
 * import { TopToolbar, SortButton, CreateButton, ExportButton } from 'react-admin';
 *
 * const ListActions: FC = props => (
 *     <TopToolbar>
 *         <SortButton fields={['reference', 'sales', 'stock']} />
 *         <CreateButton basePath={props.basePath} />
 *         <ExportButton exporter={props.exporter} />
 *     </TopToolbar>
 * );
 */
const SortButton: FC<{ fields: string[] }> = ({ fields }) => {
    const { currentSort, setSort } = useListContext();
    const translate = useTranslate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeSort = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
        const field = event.currentTarget.dataset.sort;
        setSort(
            field,
            field === currentSort.field
                ? inverseOrder(currentSort.order)
                : 'ASC'
        );
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                color="primary"
                onClick={handleClick}
                startIcon={<SortIcon />}
                endIcon={<ArrowDropDownIcon />}
                size="small"
            >
                {translate('ra.sort.sort_by', {
                    field: translate(
                        `resources.products.fields.${currentSort.field}`
                    ),
                    order: translate(`ra.sort.${currentSort.order}`),
                })}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {fields.map(field => (
                    <MenuItem
                        onClick={handleChangeSort}
                        data-sort={field}
                        key={field}
                    >
                        {translate(`resources.products.fields.${field}`)}{' '}
                        {translate(
                            `ra.sort.${
                                currentSort.field === field
                                    ? inverseOrder(currentSort.order)
                                    : 'ASC'
                            }`
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const inverseOrder = (sort: string) => (sort === 'ASC' ? 'DESC' : 'ASC');

export default SortButton;
