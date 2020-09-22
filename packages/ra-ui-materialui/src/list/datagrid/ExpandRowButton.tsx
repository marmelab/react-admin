import * as React from 'react';
import { memo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { useTranslate } from 'ra-core';

const ExpandRowButton = ({
    classes,
    expanded,
    expandContentId,
    ...props
}: ExpandRowButtonProps) => {
    const translate = useTranslate();
    return (
        <IconButton
            aria-label={translate(
                expanded ? 'ra.action.close' : 'ra.action.expand'
            )}
            aria-expanded={expanded}
            aria-controls={expandContentId}
            className={classNames(classes.expandIcon, {
                [classes.expanded]: expanded,
            })}
            component="div"
            tabIndex={-1}
            aria-hidden="true"
            {...props}
        >
            <ExpandMoreIcon />
        </IconButton>
    );
};

export interface ExpandRowButtonProps {
    classes?: any;
    expanded: boolean;
    expandContentId: string;
    onClick?: (event: any) => void;
}

export default memo(ExpandRowButton);
