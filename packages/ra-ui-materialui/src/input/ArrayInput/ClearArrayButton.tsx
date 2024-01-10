import * as React from 'react';
import ClearIcon from '@mui/icons-material/HighlightOff';

import { ButtonProps, IconButtonWithTooltip } from '../../button';

export const ClearArrayButton = (props: ButtonProps) => (
    <IconButtonWithTooltip
        label="ra.action.clear_array_input"
        size="small"
        color="warning"
        {...props}
    >
        <ClearIcon fontSize="small" />
    </IconButtonWithTooltip>
);

export default null;
