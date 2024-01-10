import * as React from 'react';
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

export const HideOnScroll = (props: HideOnScrollProps) => {
    const { children, className } = props;
    const trigger = useScrollTrigger();
    return (
        <Slide
            appear={false}
            direction="down"
            in={!trigger}
            className={className}
        >
            {children}
        </Slide>
    );
};

HideOnScroll.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export interface HideOnScrollProps {
    children: React.ReactElement;
    className?: string;
}
