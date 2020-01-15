import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            backgroundColor: theme.palette.grey[300],
            display: 'flex',
        },
    }),
    { name: 'RaPlaceholder' }
);

interface Props {
    className?: string;
    classes?: Record<'root', string>;
}

const Placeholder: FC<Props> = ({ className, classes: classesOverride }) => {
    const classes = useStyles({ classes: classesOverride });
    return <div className={classnames(className, classes.root)}>&nbsp;</div>;
};

export default Placeholder;
