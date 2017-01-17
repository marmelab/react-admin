import React, { PropTypes } from 'react';
import inflection from 'inflection';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import { LocalizedComponent } from 'admin-on-rest/i18n';

const Menu = ({ resources, translate }) => (
    <Paper style={{ flex: '0 0 15em', order: -1 }}>
        <List>
            {resources
                .filter(r => r.list)
                .map(resource =>
                    <ListItem
                        key={resource.name}
                        containerElement={<Link to={`/${resource.name}`} />}
                        primaryText={translate(resource.options.label || inflection.humanize(inflection.pluralize(resource.name)))}
                        leftIcon={<resource.icon />}
                    />,
                )
            }
        </List>
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
};

export default LocalizedComponent(pure(Menu));
