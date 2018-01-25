import React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import withStyles from 'material-ui/styles/withStyles';

const styles = {
    root: { display: 'inline-block', marginTop: '1em', zIndex: 2 },
    img: {
        width: 'initial',
        minWidth: 'initial',
        maxWidth: '42em',
        maxHeight: '15em',
    },
};

const Poster = withStyles(styles)(({ classes, record }) => (
    <Card className={classes.root}>
        <CardContent>
            <img src={record.image} alt="" className={classes.img} />
        </CardContent>
    </Card>
));

export default Poster;
