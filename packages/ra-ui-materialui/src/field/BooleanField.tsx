import * as React from 'react';
import { styled } from '@mui/material/styles';
import { SvgIconComponent } from '@mui/icons-material';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip, Typography, TypographyProps } from '@mui/material';
import { useTranslate, useRecordContext } from 'ra-core';
import { genericMemo } from './genericMemo';
import { FieldProps, fieldPropTypes } from './types';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';

const BooleanFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: BooleanFieldProps<RecordType>
) => {
    const {
        className,
        emptyText,
        source,
        valueLabelTrue,
        valueLabelFalse,
        TrueIcon = DoneIcon,
        FalseIcon = ClearIcon,
        looseValue = false,
        ...rest
    } = props;
    const record = useRecordContext<RecordType>(props);
    const translate = useTranslate();

    const value = get(record, source);
    const isTruthyValue = value === true || (looseValue && value);
    let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

    if (!ariaLabel) {
        ariaLabel = isTruthyValue ? 'ra.boolean.true' : 'ra.boolean.false';
    }

    if (looseValue || value === false || value === true) {
        return (
            <StyledTypography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                    {isTruthyValue ? (
                        TrueIcon ? (
                            <TrueIcon
                                data-testid="true"
                                fontSize="small"
                                className={classes.trueIcon}
                            />
                        ) : (
                            <></>
                        )
                    ) : FalseIcon ? (
                        <FalseIcon
                            data-testid="false"
                            fontSize="small"
                            className={classes.falseIcon}
                        />
                    ) : (
                        <></>
                    )}
                </Tooltip>
            </StyledTypography>
        );
    }

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {emptyText && translate(emptyText, { _: emptyText })}
        </Typography>
    );
};

BooleanFieldImpl.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
    TrueIcon: PropTypes.elementType,
    FalseIcon: PropTypes.elementType,
    looseValue: PropTypes.bool,
};
BooleanFieldImpl.displayName = 'BooleanFieldImpl';

export const BooleanField = genericMemo(BooleanFieldImpl);

export interface BooleanFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
    TrueIcon?: SvgIconComponent | null;
    FalseIcon?: SvgIconComponent | null;
    looseValue?: boolean;
}

const PREFIX = 'RaBooleanField';

const classes = {
    trueIcon: `${PREFIX}-trueIcon`,
    falseIcon: `${PREFIX}-falseIcon`,
};

const StyledTypography = styled(Typography, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'inline-flex',
    verticalAlign: 'middle',
    lineHeight: 0,
    [`& .${classes.trueIcon}`]: {},
    [`& .${classes.falseIcon}`]: {},
});
