import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import inflection from 'inflection';
import compose from 'recompose/compose';
import DashboardMenuItem from './DashboardMenuItem';
import MenuItemLink from './MenuItemLink';
import translate from '../../i18n/translate';
import { getResources } from '../../reducer';

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

const Menu = ({ hasDashboard, onMenuTap, resources, translate, logout }) => (
    <div style={styles.main}>
        {hasDashboard && <DashboardMenuItem onClick={onMenuTap} />}
        {resources
            .filter(r => r.list)
            .map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={translatedResourceName(resource, translate)}
                    leftIcon={<resource.icon />}
                    onClick={onMenuTap}
                />
            ))}
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

const mapStateToProps = state => ({
    resources: getResources(state),
});

const enhance = compose(translate, connect(mapStateToProps));

export default enhance(Menu);
