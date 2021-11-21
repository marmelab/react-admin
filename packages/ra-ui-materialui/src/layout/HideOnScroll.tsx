import * as React from 'react';
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

export const HideOnScroll = (props: HideOnScrollProps) => {
    const { children } = props;
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

HideOnScroll.propTypes = {
    children: PropTypes.node.isRequired,
};

export interface HideOnScrollProps {
    children: React.ReactElement;
}
