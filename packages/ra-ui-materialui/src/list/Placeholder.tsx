import * as React from 'react';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';

interface PlaceholderProps {
    className?: string;
}

export const Placeholder = (props: PlaceholderProps) => {
    return (
        <Root className={classnames(PlaceholderClasses.root, props.className)}>
            &nbsp;
        </Root>
    );
};

const PREFIX = 'RaPlaceholder';

export const PlaceholderClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled('span', { name: PREFIX })(({ theme }) => ({
    [`&.${PlaceholderClasses.root}`]: {
        backgroundColor: theme.palette.grey[300],
        display: 'flex',
    },
}));
