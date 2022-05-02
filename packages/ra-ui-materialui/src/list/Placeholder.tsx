import * as React from 'react';
import { styled } from '@mui/material/styles';
import { makeOverridesResolver } from '../makeOverridesResolver';

interface PlaceholderProps {
    className?: string;
}

export const Placeholder = (props: PlaceholderProps) => (
    <Root className={props.className}>&nbsp;</Root>
);

const PREFIX = 'RaPlaceholder';

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: makeOverridesResolver({}),
})(({ theme }) => ({
    backgroundColor: theme.palette.grey[300],
    display: 'flex',
}));
