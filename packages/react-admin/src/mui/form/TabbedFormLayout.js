import React from 'react';
import Divider from 'material-ui/Divider';

const FormTabLayout = (factory, { classes = {} }) => (
    <div>
        {factory.tabs()}
        <Divider />
        <div className={classes.form}>
            {factory.activeTab()}
            {factory.toolbar()}
        </div>
    </div>
);

export default FormTabLayout;
