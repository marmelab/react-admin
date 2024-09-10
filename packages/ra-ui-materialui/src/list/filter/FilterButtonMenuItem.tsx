import * as React from 'react';
import { forwardRef, useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { FieldTitle, useResourceContext } from 'ra-core';
import { Checkbox } from '@mui/material';

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
            >
                <Checkbox
                    size="small"
                    sx={{
                        paddingLeft: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        marginLeft: 0,
                        marginRight: '7px',
                    }}
                    disableRipple
                    defaultChecked={displayed}
                />
                <FieldTitle
                    label={filter.props.label}
                    source={filter.props.source}
                    resource={resource}
                />
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
