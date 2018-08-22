import React from 'react';
import { SaveButton } from 'ra-ui-materialui';
import TreeNodeActions from './TreeNodeActions';

const TreeFormActions = props => (
    <TreeNodeActions {...props}>
        <SaveButton variant="flat" />
    </TreeNodeActions>
);

export default TreeFormActions;
