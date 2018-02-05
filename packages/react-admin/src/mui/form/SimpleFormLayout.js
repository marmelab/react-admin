import React from 'react';

const SimpleFormLayout = (factory, { className, version }) => (
    <div>
        <div className={className} key={version}>
            {factory.fields()}
        </div>
        {factory.toolbar()}
    </div>
);
export default SimpleFormLayout;
