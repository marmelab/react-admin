import React from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import { connect } from 'react-redux';

import compose from 'recompose/compose';
import DashboardMenuItem from './DashboardMenuItem';
import MenuItemLink from './MenuItemLink';
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
        _:
            resource.options && resource.options.label
                ? translate(resource.options.label, {
                      smart_count: 2,
                      _: resource.options.label,
                  })
                : inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = ({ hasDashboard, onMenuTap, resources, translate, logout }) =>
    <div style={styles.main}>
        {hasDashboard && <DashboardMenuItem onTouchTap={onMenuTap} />}
        {resources
            .filter(r => r.showInMenu)
            .map(resource =>
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={translatedResourceName(resource, translate)}
                    leftIcon={<resource.icon />}
                    onTouchTap={onMenuTap}
                />
            )}
        {logout}
    </div>;

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

const mapStateToProps = state => ({
    resources: Object.keys(state.admin.resources).map(r => ({
        name: r,
        ...state.admin.resources[r].ui,
    })),
});

const enhance = compose(connect(mapStateToProps), translate);

export default enhance(Menu);
