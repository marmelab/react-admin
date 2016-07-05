import React from 'react';

export default ({ name, path, children }) => React.cloneElement(children, { resource: name, path });
