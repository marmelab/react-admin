import * as React from 'react';
import { createElement } from 'react';
import DefaultIcon from '@mui/icons-material/ViewList';

import {
    useResourceDefinitions,
    useGetResourceLabel,
    useCreatePath,
} from 'ra-core';

import { MenuItemLink } from './MenuItemLink';

export const ResourceMenuItem = ({ name }: { name: string }) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const createPath = useCreatePath();
    if (!resources || !resources[name]) return null;
    return (
        <MenuItemLink
            to={createPath({
                resource: name,
                type: 'list',
            })}
            state={{ _scrollToTop: true }}
            primaryText={<>{getResourceLabel(name, 2)}</>}
            leftIcon={
                resources[name].icon ? (
                    createElement(resources[name].icon)
                ) : (
                    <DefaultIcon />
                )
            }
        />
    );
};
