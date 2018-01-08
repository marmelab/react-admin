import React from 'react';
import PropTypes from 'prop-types';
import { BulkActionButton, MenuButton } from '../../mui/button';
import BulkActionDelete from './BulkActionDelete';

const BulkActions = ({
    children,
    resource,
    selection,
    selectionData,
    ...props
}) => (
    <MenuButton
        button={BulkActionButton}
        selectedItems={selection.length}
        disabled={selection.length === 0}
        {...props}
    >
        {children ? (
            React.Children.toArray(children).map((child, index) =>
                React.cloneElement(child, {
                    key: `bulk-action-${index}`,
                    resource,
                    selection,
                    selectionData,
                })
            )
        ) : (
            <BulkActionDelete
                resource={resource}
                selection={selection}
                selectionData={selectionData}
            />
        )}
    </MenuButton>
);

BulkActions.propTypes = {
    resource: PropTypes.string,
    selection: PropTypes.array,
    selectionData: PropTypes.object,
    classes: PropTypes.object,
    children: PropTypes.node,
};

export default BulkActions;
