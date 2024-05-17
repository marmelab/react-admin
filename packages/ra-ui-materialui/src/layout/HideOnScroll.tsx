import * as React from 'react';
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

export interface HideOnScrollProps {
    children: React.ReactElement;
    className?: string;
}
