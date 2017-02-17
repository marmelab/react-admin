import React, { Component, PropTypes } from 'react';
import inflection from 'inflection';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import { SMALL } from 'material-ui/utils/withWidth';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

const styles = {
    small: {},
    notSmall: {
        zIndex: 0,
        paddingTop: 60,
    },
};

class Menu extends Component {
    handleRequestChange = (open, reason) => {
        if (reason === 'clickaway') this.props.toggleSidebar();
    }

    translatedResourceName(resource) {
        return this.props.translate(`resources.${resource.name}.name`, {
            smart_count: 2,
            _: resource.options.label ?
                this.props.translate(resource.options.label, { smart_count: 2, _: resource.options.label }) :
                inflection.humanize(inflection.pluralize(resource.name)),
        });
    }

    render() {
        const { resources, translate, logout, open, width } = this.props;
        return (
            <Drawer containerStyle={width === SMALL ? styles.small : styles.notSmall} open={open} onRequestChange={this.handleRequestChange} docked={width !== SMALL}>
                <List>
                    {resources
                        .filter(r => r.list)
                        .map(resource =>
                            <ListItem
                                key={resource.name}
                                containerElement={<Link to={`/${resource.name}`} />}
                                primaryText={this.translatedResourceName(resource)}
                                leftIcon={<resource.icon />}
                            />,
                        )
                    }
                </List>
                {logout}
            </Drawer>
        );
    }
}

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
    logout: PropTypes.element,
    toggleSidebar: PropTypes.func.isRequired,
    open: PropTypes.bool,
    width: PropTypes.number.isRequired,
};

const enhanced = compose(
    translate,
    pure,
);

export default enhanced(Menu);
