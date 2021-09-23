import * as React from 'react';

import { IconButtonWithTooltip } from '../../button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export const ReOrderButtons = ({
    className,
    index,
    max,
    onReorder,
}: {
    className?: string;
    index?: number;
    max?: number;
    onReorder?: (origin: number, destination: number) => void;
}) => (
    <div className={className}>
        <IconButtonWithTooltip
            label="ra.action.move_up"
            size="small"
            onClick={() => onReorder(index, index - 1)}
            disabled={index <= 0}
        >
            <ArrowUpwardIcon />
        </IconButtonWithTooltip>
        <IconButtonWithTooltip
            label="ra.action.move_down"
            size="small"
            onClick={() => onReorder(index, index + 1)}
            disabled={max == null || index >= max - 1}
        >
            <ArrowDownwardIcon />
        </IconButtonWithTooltip>
    </div>
);
