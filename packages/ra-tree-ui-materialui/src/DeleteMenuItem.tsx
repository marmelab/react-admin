import React, { SFC, ComponentType, ReactElement } from 'react';
import { Record } from 'ra-core';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import DeleteWithUndoMenuItem from './DeleteWithUndoMenuItem';
import DeleteWithConfirmMenuItem from './DeleteWithConfirmMenuItem';

interface Props {
    label?: string;
    icon: ReactElement<any>;
    undoable: boolean;
}

interface InjectedProps {
    basePath: string;
    record: Record;
    parentSource: string;
    positionSource?: string;
}

const DeleteMenuItem: SFC<Props & InjectedProps & MenuItemProps> = ({
    undoable = true,
    ...props
}) =>
    undoable ? (
        <DeleteWithUndoMenuItem {...props} />
    ) : (
        <DeleteWithConfirmMenuItem {...props} />
    );

export default DeleteMenuItem as ComponentType<Props & MenuItemProps>;
