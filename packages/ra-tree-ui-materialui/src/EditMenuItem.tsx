import React, { SFC, ComponentType, ReactElement } from 'react';
import { Record, withTranslate, Translate } from 'ra-core';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

interface Props {
    label?: string;
    icon: ReactElement<any>;
}

interface InjectedProps {
    basePath: string;
    record: Record;
    parentSource: string;
    positionSource?: string;
    translate: Translate;
}

const EditMenuItemView: SFC<Props & InjectedProps & MenuItemProps> = ({
    basePath,
    label = 'ra.action.edit',
    parentSource,
    positionSource,
    record,
    translate,
    ...props
}) => {
    return (
        <MenuItem
            // @ts-ignore
            component={Link}
            to={`${basePath}/${record.id}/edit`}
            {...props}
        >
            {translate(label)}
        </MenuItem>
    );
};

const EditMenuItem = withTranslate(
    // @ts-ignore
    EditMenuItemView
) as ComponentType<Props & MenuItemProps>;

export default EditMenuItem;
