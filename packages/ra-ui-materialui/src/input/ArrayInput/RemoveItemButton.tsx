import * as React from 'react';
import CloseIcon from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';

import { IconButtonWithTooltip, ButtonProps } from '../../button';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';
import { useSimpleFormIterator } from './useSimpleFormIterator';

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
