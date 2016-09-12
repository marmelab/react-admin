import React from 'react';

export default additionalProps => LayoutComponent => props => (
	<LayoutComponent {...additionalProps} {...props} />
);
