import * as React from 'react';
import { FC, memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';
import FalseIcon from '@material-ui/icons/Clear';
import TrueIcon from '@material-ui/icons/Done';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TypographyProps } from '@material-ui/core/Typography';
import { useTranslate } from 'ra-core';

import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import sanitizeRestProps from './sanitizeRestProps';

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
                    {...sanitizeRestProps(rest)}
                >
                    <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                        {value === true ? (
                            <TrueIcon data-testid="true" fontSize="small" />
                        ) : (
                            <FalseIcon data-testid="false" fontSize="small" />
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
                {...sanitizeRestProps(rest)}
            >
                {emptyText}
            </Typography>
        );
    }
);

BooleanField.defaultProps = {
    addLabel: true,
};

BooleanField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
};

export interface BooleanFieldProps
    extends FieldProps,
        InjectedFieldProps,
        TypographyProps {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
}

export default BooleanField;
