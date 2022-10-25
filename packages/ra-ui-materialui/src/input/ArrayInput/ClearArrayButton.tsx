import * as React from 'react';
import { ButtonProps, IconButtonWithTooltip } from '../../button';
import ClearIcon from '@mui/icons-material/HighlightOff';

interface ClearArrayButtonProps extends ButtonProps {
    className?: string;
}

export const ClearArrayButton: React.FC<ClearArrayButtonProps> = props => {
    return (
        <IconButtonWithTooltip
            label="ra.action.clear_array_input"
            size="small"
            color="warning"
            {...props}
        >
            <ClearIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};

export default null;
