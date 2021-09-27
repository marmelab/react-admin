import * as React from 'react';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';

import { Button, ButtonProps } from '../../button';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';

export const RemoveItemButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { remove } = useSimpleFormIteratorItem();

    return (
        <Button label="ra.action.remove" onClick={() => remove()} {...props}>
            <CloseIcon />
        </Button>
    );
};
