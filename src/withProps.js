import React from 'react';

export default (outerProps) => LayoutComponent => props => (
    <LayoutComponent {...outerProps} {...props} />
);
