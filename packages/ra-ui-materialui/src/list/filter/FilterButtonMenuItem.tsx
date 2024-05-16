import * as React from 'react';
import { forwardRef, useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { FieldTitle, useResourceContext } from 'ra-core';

export const FilterButtonMenuItem = forwardRef<any, FilterButtonMenuItemProps>(
    (props, ref) => {
        const { filter, onShow, autoFocus } = props;
        const resource = useResourceContext(props);
        const handleShow = useCallback(() => {
            onShow({
                source: filter.props.source,
                defaultValue: filter.props.defaultValue,
            });
        }, [filter.props.defaultValue, filter.props.source, onShow]);

        return (
            <MenuItem
                className="new-filter-item"
                data-key={filter.props.source}
                data-default-value={filter.props.defaultValue}
                key={filter.props.source}
                onClick={handleShow}
                autoFocus={autoFocus}
                ref={ref}
                disabled={filter.props.disabled}
            >
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
    onShow: (params: { source: string; defaultValue: any }) => void;
    resource?: string;
    autoFocus?: boolean;
}
