import * as React from 'react';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import { useSimpleFormIterator } from './useSimpleFormIterator';

import { IconButtonWithTooltip, ButtonProps } from '../../button';

export const AddItemButton = (props: ButtonProps) => {
    const { add } = useSimpleFormIterator();
    return (
        <IconButtonWithTooltip
            label="ra.action.add"
            size="small"
            onClick={() => add()}
            color="primary"
            {...props}
        >
            <AddIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};
