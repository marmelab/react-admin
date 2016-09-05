import React from 'react';

export default title => LayoutComponent => props => (
    <LayoutComponent title={title} {...props} />
);
