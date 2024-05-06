import * as React from 'react';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import clsx from 'clsx';
import { useSimpleFormIterator } from './useSimpleFormIterator';
import { IconButtonWithTooltip, ButtonProps } from '../../button';

export const AddItemButton = (props: ButtonProps) => {
    const { add, source } = useSimpleFormIterator();
    const { className, ...rest } = props;
    return (
        <IconButtonWithTooltip
            label="ra.action.add"
            size="small"
            onClick={() => add()}
            color="primary"
            className={clsx(`button-add button-add-${source}`, className)}
            {...rest}
        >
            <AddIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};
