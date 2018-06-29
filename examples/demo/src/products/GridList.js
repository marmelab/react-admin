import React from 'react';
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ContentCreate from '@material-ui/icons/Create';
import { NumberField, Link } from 'react-admin';
import { linkToRecord } from 'ra-core';

const styles = {
    root: {
        margin: '-2px',
    },
    gridList: {
        width: '100%',
        margin: 0,
    },
    tileBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
    },
    link: {
        color: '#fff',
    },
};

const GridList = ({ classes, ids, data, basePath }) => (
    <div className={classes.root}>
        <MuiGridList cellHeight={180} cols={4} className={classes.gridList}>
            {ids.map(id => (
                <GridListTile key={id}>
                    <img src={data[id].thumbnail} alt="" />
                    <GridListTileBar
                        className={classes.tileBar}
                        title={data[id].reference}
                        subtitle={
                            <span>
                                {data[id].width}x{data[id].height},{' '}
                                <b>
                                    <NumberField
                                        source="price"
                                        record={data[id]}
                                        options={{
                                            style: 'currency',
                                            currency: 'USD',
                                        }}
                                    />
                                </b>
                            </span>
                        }
                        actionIcon={
                            <IconButton
                                to={linkToRecord(basePath, data[id].id)}
                                className={classes.link}
                                component={Link}
                            >
                                <ContentCreate />
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))}
        </MuiGridList>
    </div>
);

export default withStyles(styles)(GridList);
