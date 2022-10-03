import * as React from 'react';
import CloseIcon from '@mui/icons-material/RemoveCircleOutline';

import { IconButtonWithTooltip, ButtonProps } from '../../button';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';

export const RemoveItemButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { remove } = useSimpleFormIteratorItem();

    return (
        <IconButtonWithTooltip
            label="ra.action.remove"
            size="small"
            onClick={() => remove()}
            color="warning"
            {...props}
        >
            <CloseIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};
