import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

import { ListButton, ShowButton, EditButton } from '../button';

const styles = {
    cardActionStyle: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
};

const DeleteActions = ({
    basePath,
    classes,
    data,
    hasEdit,
    hasList,
    hasShow,
}) => (
    <CardActions className={classes.cardActionStyle}>
        {hasList && <ListButton basePath={basePath} />}
        {hasEdit && <EditButton basePath={basePath} record={data} />}
        {hasShow && <ShowButton basePath={basePath} record={data} />}
    </CardActions>
);

DeleteActions.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    data: PropTypes.object,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
};

export default withStyles(styles)(DeleteActions);
