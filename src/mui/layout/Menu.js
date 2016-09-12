import React, { PropTypes } from 'react';
import inflection from 'inflection';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

const Menu = ({ resources, basePath }) => (
    <Paper style={{ flex: '0 0 15em', order: -1 }}>
        <List>
            {resources.map(resource =>
                <ListItem key={resource.name} containerElement={<Link to={basePath?`/${basePath}/${resource.name}`:`/${resource.name}`} />} primaryText={resource.options.label || inflection.humanize(inflection.pluralize(resource.name))} leftIcon={<resource.icon />} />
            )}
        </List>
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
    basePath: PropTypes.string
};

export default Menu;
