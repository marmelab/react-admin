import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import SettingsIcon from 'material-ui-icons/Settings';
import LabelIcon from 'material-ui-icons/Label';
import { translate, DashboardMenuItem, MenuItemLink } from 'react-admin';

import { VisitorIcon } from './visitors';
import { CommandIcon } from './commands';
import { ProductIcon } from './products';
import { CategoryIcon } from './categories';
import { ReviewIcon } from './reviews';

const items = [
    { name: 'Customer', icon: <VisitorIcon /> },
    { name: 'Segment', icon: <LabelIcon /> },
    { name: 'Command', icon: <CommandIcon /> },
    { name: 'Product', icon: <ProductIcon /> },
    { name: 'Category', icon: <CategoryIcon /> },
    { name: 'Review', icon: <ReviewIcon /> },
];

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

const Menu = ({ onMenuTap, translate, logout }) => (
    <div style={styles.main}>
        <DashboardMenuItem onClick={onMenuTap} />
        {items.map(item => (
            <MenuItemLink
                key={item.name}
                to={`/${item.name}`}
                primaryText={translate(`resources.${item.name}.name`, {
                    smart_count: 2,
                })}
                leftIcon={item.icon}
                onClick={onMenuTap}
            />
        ))}
        <MenuItemLink
            to="/configuration"
            primaryText={translate('pos.configuration')}
            leftIcon={<SettingsIcon />}
            onClick={onMenuTap}
        />
        {logout}
    </div>
);

const enhance = compose(
    connect(state => ({
        theme: state.theme,
        locale: state.i18n.locale,
    })),
    translate
);

export default enhance(Menu);
