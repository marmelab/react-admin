import * as React from 'react';
import clsx from 'clsx';
import { IconButtonWithTooltip } from '../../button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowDownwardIcon from '@mui/icons-material/ArrowCircleDown';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';
import { useSimpleFormIterator } from './useSimpleFormIterator';

export const ReOrderButtons = ({ className }: { className?: string }) => {
    const { index, total, reOrder } = useSimpleFormIteratorItem();
    const { source } = useSimpleFormIterator();

    return (
        <span
            className={clsx(
                `button-reorder button-reorder-${source}-${index}`,
                className
            )}
        >
            <IconButtonWithTooltip
                label="ra.action.move_up"
                size="small"
                onClick={() => reOrder(index - 1)}
                disabled={index <= 0}
                color="primary"
            >
                <ArrowUpwardIcon fontSize="small" />
            </IconButtonWithTooltip>
            <IconButtonWithTooltip
                label="ra.action.move_down"
                size="small"
                onClick={() => reOrder(index + 1)}
                disabled={total == null || index >= total - 1}
                color="primary"
            >
                <ArrowDownwardIcon fontSize="small" />
            </IconButtonWithTooltip>
        </span>
    );
};
