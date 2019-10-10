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

const AddChildNodeMenuItemView: SFC<Props & InjectedProps & MenuItemProps> = ({
    basePath,
    label = 'ra.tree.add_child_node',
    parentSource,
    positionSource,
    record: parentRecord,
    translate,
    ...props
}) => {
    const record = {
        [parentSource]: parentRecord.id,
    };

    if (positionSource) {
        record[positionSource] = 0;
    }

    return (
        <MenuItem
            // @ts-ignore
            component={Link}
            to={{
                pathname: `${basePath}/create`,
                state: { record },
            }}
            label={label}
            {...props}
        >
            {translate(label)}
        </MenuItem>
    );
};

const AddChildNodeMenuItem = withTranslate(
    // @ts-ignore
    AddChildNodeMenuItemView
) as ComponentType<Props & MenuItemProps>;

export default AddChildNodeMenuItem;
