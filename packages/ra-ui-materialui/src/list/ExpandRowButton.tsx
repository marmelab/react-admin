import React, { memo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { useTranslate } from 'ra-core';

const ExpandRowButton = ({ classes, expanded, expandContentId, ...props }) => {
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

export default memo(ExpandRowButton);
