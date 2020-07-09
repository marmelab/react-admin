import * as React from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useListContext } from 'react-admin';

const SortButton = () => {
    const { currentSort, setSort } = useListContext();
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
    console.log(currentSort);
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
                Order by: {currentSort.field} {currentSort.order}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleChangeSort} data-sort="reference">
                    Name{' '}
                    {currentSort.field === 'reference'
                        ? inverseOrder(currentSort.order)
                        : 'ASC'}
                </MenuItem>
                <MenuItem onClick={handleChangeSort} data-sort="sales">
                    Sales{' '}
                    {currentSort.field === 'sales'
                        ? inverseOrder(currentSort.order)
                        : 'ASC'}
                </MenuItem>
                <MenuItem onClick={handleChangeSort} data-sort="stock">
                    Stock{' '}
                    {currentSort.field === 'stock'
                        ? inverseOrder(currentSort.order)
                        : 'ASC'}
                </MenuItem>
            </Menu>
        </>
    );
};

const inverseOrder = (sort: string) => (sort === 'ASC' ? 'DESC' : 'ASC');

export default SortButton;
