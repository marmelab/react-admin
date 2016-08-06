import React, { PropTypes } from 'react';
import inflection from 'inflection';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

const Menu = ({ resources }) => (
    <Paper style={{ flexBasis: '15em' }}>
        <List>
            {resources.map(resource =>
                <ListItem key={resource.name} containerElement={<Link to={`/${resource.name}`} />} primaryText={resource.options.label || inflection.humanize(inflection.pluralize(resource.name))} leftIcon={<resource.icon />} />
            )}
        </List>
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
};

export default Menu;
