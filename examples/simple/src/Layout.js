import React from 'react';
import { Layout } from 'react-admin';
import { withStyles, createStyles } from '@material-ui/core/styles';

const styles = createStyles({
    root: {
        overflowX: 'auto', // Required for expanding nodes on hover when dragging elements in ra-tree
    },
});

const TreeLayout = ({ classes, ...props }) => (
    <Layout {...props} className={classes.root} />
);

export default withStyles(styles)(TreeLayout);
