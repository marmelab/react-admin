import * as React from 'react';
import { memo, FC } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip, Typography, TypographyProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslate, useRecordContext } from 'ra-core';

import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import sanitizeFieldRestProps from './sanitizeFieldRestProps';

const useStyles = makeStyles(
    {
        root: {
            display: 'flex',
        },
    },
    {
        name: 'RaBooleanField',
    }
);

const BooleanField: FC<BooleanFieldProps> = memo(props => {
    const {
        className,
        classes: classesOverride,
        emptyText,
        source,
        valueLabelTrue,
        valueLabelFalse,
        TrueIcon,
        FalseIcon,
        looseValue,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const translate = useTranslate();
    const classes = useStyles(props);
    const value = get(record, source);
    const isTruthyValue = value === true || (looseValue && value);
    let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

    if (!ariaLabel) {
        ariaLabel = isTruthyValue ? 'ra.boolean.true' : 'ra.boolean.false';
    }

    if (looseValue || value === false || value === true) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={classnames(classes.root, className)}
                {...sanitizeFieldRestProps(rest)}
            >
                <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                    {isTruthyValue ? (
                        <span>
                            <TrueIcon data-testid="true" fontSize="small" />
                        </span>
                    ) : (
                        <span>
                            <FalseIcon data-testid="false" fontSize="small" />
                        </span>
                    )}
                </Tooltip>
            </Typography>
        );
    }

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {emptyText}
        </Typography>
    );
});

BooleanField.defaultProps = {
    addLabel: true,
    TrueIcon: DoneIcon,
    FalseIcon: ClearIcon,
    looseValue: false,
};

BooleanField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
    TrueIcon: PropTypes.elementType,
    FalseIcon: PropTypes.elementType,
    looseValue: PropTypes.bool,
};

BooleanField.displayName = 'BooleanField';

export interface BooleanFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        Omit<TypographyProps, 'textAlign'> {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
    TrueIcon?: SvgIconComponent;
    FalseIcon?: SvgIconComponent;
    looseValue?: boolean;
}

export default BooleanField;
