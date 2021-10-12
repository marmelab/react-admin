import * as React from 'react';
import CloseIcon from '@mui/icons-material/RemoveCircleOutline';

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
