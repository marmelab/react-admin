import React from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import DashboardMenuItem from './DashboardMenuItem';
import translate from '../../i18n/translate';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _: resource.options && resource.options.label ?
            translate(resource.options.label, { smart_count: 2, _: resource.options.label }) :
            inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = ({ hasDashboard, onMenuTap, resources, translate, logout }) => (
    <div style={styles.main}>
        {hasDashboard && <DashboardMenuItem onTouchTap={onMenuTap} />}
        {resources
            .filter(r => r.list)
            .map(resource =>
                    <MenuItem
                        key={resource.name}
                        containerElement={<Link to={`/${resource.name}`} />}
                        primaryText={translatedResourceName(resource, translate)}
                        leftIcon={<resource.icon />}
                        onTouchTap={onMenuTap}
                    />
            )
        }
        {logout}
    </div>
);

Menu.propTypes = {
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuTap: PropTypes.func,
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
};

Menu.defaultProps = {
    onMenuTap: () => null,
};

const enhance = compose(
    pure,
    translate,
);

export default enhance(Menu);
