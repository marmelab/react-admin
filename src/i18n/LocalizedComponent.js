import React, { PropTypes } from 'react';

const localized = (BaseComponent) => {
    const LocalizedComponent = (props, context) => (
        <BaseComponent
            translate={context.translate}
            locale={context.locale}
            {...props}
        />
    );

    LocalizedComponent.contextTypes = {
        translate: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
    };

    LocalizedComponent.displayName = BaseComponent.name;

    return LocalizedComponent;
};

export default localized;
