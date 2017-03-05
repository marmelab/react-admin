import React, { PropTypes } from 'react';
import inflection from 'inflection';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import translate from '../../i18n/translate';

const style = {
    flex: '0 0 15em',
    order: -1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _: resource.options && resource.options.label ?
            translate(resource.options.label, { smart_count: 2, _: resource.options.label }) :
            inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = ({ resources, translate, logout }) => (
    <Paper style={style}>
        <List>
            {resources
                .filter(r => r.list)
                .map(resource =>
                    <ListItem
                        key={resource.name}
                        containerElement={<Link to={`/${resource.name}`} />}
                        primaryText={translatedResourceName(resource, translate)}
                        leftIcon={resource.icon && <resource.icon />}
                    />,
                )
            }
        </List>
        {logout}
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
    logout: PropTypes.element,
};

export default translate(pure(Menu));
