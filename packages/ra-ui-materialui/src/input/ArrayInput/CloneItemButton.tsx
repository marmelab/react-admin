import * as React from 'react';
import QueueIcon from '@material-ui/icons/Queue';
import { Button, ButtonProps } from '../../button';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';

export const CloneItemButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { clone } = useSimpleFormIteratorItem();

    return (
        <Button label="ra.action.clone" onClick={() => clone()} {...props}>
            <QueueIcon />
        </Button>
    );
};
