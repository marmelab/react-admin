import * as React from 'react';
import { forwardRef, useCallback } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { FieldTitle, useResourceContext } from 'ra-core';

export const FilterButtonMenuItem = forwardRef<any, FilterButtonMenuItemProps>(
    (props, ref) => {
        const { filter, onShow, onHide, autoFocus, displayed } = props;
        const resource = useResourceContext(props);
        const handleShow = useCallback(() => {
            onShow({
                source: filter.props.source,
                defaultValue: filter.props.defaultValue,
            });
        }, [filter.props.defaultValue, filter.props.source, onShow]);
        const handleHide = useCallback(() => {
            onHide({
                source: filter.props.source,
            });
        }, [filter.props.source, onHide]);

        return (
            <MenuItem
                className="new-filter-item"
                data-key={filter.props.source}
                data-default-value={filter.props.defaultValue}
                key={filter.props.source}
                onClick={displayed ? handleHide : handleShow}
                autoFocus={autoFocus}
                ref={ref}
                disabled={filter.props.disabled}
                role="menuitemcheckbox"
                aria-checked={displayed}
            >
                <ListItemIcon>
                    {displayed ? (
                        <CheckBoxIcon fontSize="small" />
                    ) : (
                        <CheckBoxOutlineBlankIcon fontSize="small" />
                    )}
                </ListItemIcon>
                <ListItemText>
                    <FieldTitle
                        label={filter.props.label}
                        source={filter.props.source}
                        resource={resource}
                    />
                </ListItemText>
            </MenuItem>
        );
    }
);

export interface FilterButtonMenuItemProps {
    filter: JSX.Element;
    displayed: boolean;
    onShow: (params: { source: string; defaultValue: any }) => void;
    onHide: (params: { source: string }) => void;
    resource?: string;
    autoFocus?: boolean;
}
