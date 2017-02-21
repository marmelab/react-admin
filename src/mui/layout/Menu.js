import React, { PropTypes } from 'react';
import inflection from 'inflection';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

const styles = {
    open: {
        flex: '0 0 16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 0,
    },
    closed: {
        flex: '0 0 16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: '-16em',
    },
};

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _: resource.options.label ?
            translate(resource.options.label, { smart_count: 2, _: resource.options.label }) :
            inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = ({ resources, translate, logout, open }) => (
    <Paper style={open ? styles.open : styles.closed}>
        <List>
            {resources
                .filter(r => r.list)
                .map(resource =>
                    <ListItem
                        key={resource.name}
                        containerElement={<Link to={`/${resource.name}`} />}
                        primaryText={translatedResourceName(resource, translate)}
                        leftIcon={<resource.icon />}
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

const enhanced = compose(
    pure,
    translate,
);

export default enhanced(Menu);
