import * as React from 'react';
import { FC, memo } from 'react';
import { SvgIconComponent } from '@material-ui/icons';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TypographyProps } from '@material-ui/core/Typography';
import { useTranslate } from 'ra-core';

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

export const BooleanField: FC<BooleanFieldProps> = memo<BooleanFieldProps>(
    props => {
        const {
            className,
            classes: classesOverride,
            emptyText,
            source,
            record = {},
            valueLabelTrue,
            valueLabelFalse,
            TrueIcon,
            FalseIcon,
            ...rest
        } = props;
        const translate = useTranslate();
        const classes = useStyles(props);
        const value = get(record, source);
        let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

        if (!ariaLabel) {
            ariaLabel =
                value === false ? 'ra.boolean.false' : 'ra.boolean.true';
        }

        if (value === false || value === true) {
            return (
                <Typography
                    component="span"
                    variant="body2"
                    className={classnames(classes.root, className)}
                    {...sanitizeFieldRestProps(rest)}
                >
                    <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                        {value === true ? (
                            <span>
                                <TrueIcon data-testid="true" fontSize="small" />
                            </span>
                        ) : (
                            <span>
                                <FalseIcon
                                    data-testid="false"
                                    fontSize="small"
                                />
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
    }
);

BooleanField.defaultProps = {
    addLabel: true,
    TrueIcon: DoneIcon,
    FalseIcon: ClearIcon,
};

BooleanField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
    TrueIcon: PropTypes.elementType,
    FalseIcon: PropTypes.elementType,
};

export interface BooleanFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        TypographyProps {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
    TrueIcon?: SvgIconComponent;
    FalseIcon?: SvgIconComponent;
}

export default BooleanField;
