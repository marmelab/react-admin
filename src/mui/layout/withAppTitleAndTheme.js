import React from 'react';

export default (title, theme) => LayoutComponent => props => (
    <LayoutComponent title={title} theme={theme} {...props} />
);
