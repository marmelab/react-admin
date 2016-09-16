import React, { PropTypes } from 'react';
import inflection from 'inflection';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import { Link } from 'react-router';

const SelectableList = MakeSelectable(List);

const Menu = ({ resources, open = false, selectedItem, handleSelectionChange, handleRequestChange }) => (
    <Drawer docked={false} open={open} onRequestChange={handleRequestChange}>
        <SelectableList value={selectedItem} onChange={handleSelectionChange}>
            {resources.map((resource, index) =>
                <ListItem value={index} key={resource.name} containerElement={<Link to={`/${resource.name}`} />} primaryText={resource.options.label || inflection.humanize(inflection.pluralize(resource.name))} leftIcon={<resource.icon />} />
            )}
        </SelectableList>
    </Drawer>
);

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
    open: PropTypes.bool,
    selectedItem: PropTypes.number.isRequired,
    handleSelectionChange: PropTypes.func.isRequired,
    handleRequestChange: PropTypes.func.isRequired,
};

export default Menu;
