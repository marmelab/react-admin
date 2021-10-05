import * as React from 'react';

import { IconButtonWithTooltip } from '../../button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';

export const ReOrderButtons = ({ className }: { className?: string }) => {
    const { index, total, reOrder } = useSimpleFormIteratorItem();

    return (
        <div className={className}>
            <IconButtonWithTooltip
                label="ra.action.move_up"
                size="small"
                onClick={() => reOrder(index - 1)}
                disabled={index <= 0}
            >
                <ArrowUpwardIcon />
            </IconButtonWithTooltip>
            <IconButtonWithTooltip
                label="ra.action.move_down"
                size="small"
                onClick={() => reOrder(index + 1)}
                disabled={total == null || index >= total - 1}
            >
                <ArrowDownwardIcon />
            </IconButtonWithTooltip>
        </div>
    );
};
