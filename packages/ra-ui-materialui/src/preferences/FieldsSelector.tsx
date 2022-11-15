import * as React from 'react';
import { usePreference, useTranslate } from 'ra-core';
import { Box, Button } from '@mui/material';

import { FieldToggle } from './FieldToggle';

/**
 * UI to select / deselect fields, and store the selection in preferences
 */
export const FieldsSelector = ({
    name = 'columns',
    availableName = 'availableColumns',
}) => {
    const translate = useTranslate();

    const [availableFields] = usePreference<SelectableField[]>(
        availableName,
        []
    );
    const [omit] = usePreference('omit', []);

    const [fields, setFields] = usePreference(
        name,
        availableFields
            .filter(field => !omit?.includes(field.source))
            .map(field => field.index)
    );

    const handleToggle = event => {
        if (event.target.checked) {
            // add the column at the right position
            setFields(
                availableFields
                    .filter(
                        field =>
                            field.index === event.target.name ||
                            fields.includes(field.index)
                    )
                    .map(field => field.index)
            );
        } else {
            setFields(fields.filter(index => index !== event.target.name));
        }
    };

    const handleHideAll = () => {
        setFields([]);
    };
    const handleShowAll = () => {
        setFields(availableFields.map(field => field.index));
    };
    return (
        <div>
            {availableFields.map(field => (
                <FieldToggle
                    key={field.index}
                    source={field.source}
                    label={field.label}
                    index={field.index}
                    selected={fields.includes(field.index)}
                    onToggle={handleToggle}
                />
            ))}
            <Box display="flex" justifyContent="space-between" mx={-0.5} mt={1}>
                <Button size="small" onClick={handleHideAll}>
                    {translate('ra.inspector.hideAll', {
                        _: 'Hide All',
                    })}
                </Button>
                <Button size="small" onClick={handleShowAll}>
                    {translate('ra.inspector.showAll', {
                        _: 'Show All',
                    })}
                </Button>
            </Box>
        </div>
    );
};

export interface SelectableField {
    index: string;
    source: string;
    label?: string;
}
