import React, { SFC } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { withTranslate, Translate } from 'ra-core';

interface Props {
    classes: {
        expandIcon: string;
        expanded: string;
    };
    expanded: boolean;
    expandContentId: string;
    translate: Translate;
    locale: string;
}

const ExpandRowButton: SFC<Props> = ({
    classes,
    expanded,
    expandContentId,
    translate,
    ...props
}) => {
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

export default withTranslate<Props>(ExpandRowButton);
