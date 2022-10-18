import * as React from 'react';
import { FieldTitle, useResourceContext } from 'ra-core';
import { Switch, Typography } from '@mui/material';

/**
 * UI to edit a field in a DatagridEditor
 */
export const FieldEditor = props => {
    const { selected, label, onToggle, source, index } = props;
    const resource = useResourceContext();
    return (
        <div key={source}>
            <label htmlFor={`switch_${index}`}>
                <Switch
                    checked={selected}
                    onChange={onToggle}
                    name={index}
                    id={`switch_${index}`}
                    size="small"
                    sx={{
                        mr: 0.5,
                        ml: -0.5,
                    }}
                />
                <Typography variant="body2" component="span">
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                    />
                </Typography>
            </label>
        </div>
    );
};
