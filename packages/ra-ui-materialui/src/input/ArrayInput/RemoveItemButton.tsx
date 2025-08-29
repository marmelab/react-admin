import * as React from 'react';
import CloseIcon from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';
import { useSimpleFormIterator, useSimpleFormIteratorItem } from 'ra-core';

import { IconButtonWithTooltip, ButtonProps } from '../../button';

export const RemoveItemButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { remove, index } = useSimpleFormIteratorItem();
    const { source } = useSimpleFormIterator();
    const { className, ...rest } = props;

    return (
        <IconButtonWithTooltip
            label="ra.action.remove"
            size="small"
            onClick={() => remove()}
            color="warning"
            className={clsx(
                `button-remove button-remove-${source}-${index}`,
                className
            )}
            {...rest}
        >
            <CloseIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};
