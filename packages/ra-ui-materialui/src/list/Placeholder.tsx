import * as React from 'react';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';

const PREFIX = 'RaPlaceholder';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled('span')(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.grey[300],
        display: 'flex',
    },
}));

interface Props {
    className?: string;
}

const Placeholder = (props: Props) => {
    return (
        <Root className={classnames(classes.root, props.className)}>
            &nbsp;
        </Root>
    );
};

export default Placeholder;
