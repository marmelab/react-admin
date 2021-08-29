import * as React from 'react';
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

const Placeholder = (props: Props) => {
    const classes = useStyles(props);
    return (
        <span className={classnames(classes.root, props.className)}>
            &nbsp;
        </span>
    );
};

export default Placeholder;
