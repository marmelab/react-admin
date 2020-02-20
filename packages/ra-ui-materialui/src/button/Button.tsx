import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    Button as MuiButton,
    Tooltip,
    IconButton,
    useMediaQuery,
    makeStyles,
    PropTypes as MuiPropTypes,
} from '@material-ui/core';
import { ButtonProps as MuiButtonProps } from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

/**
 * A generic Button with side icon. Only the icon is displayed on small screens.
 *
 * The component translates the label. Pass the icon as child.
 * The icon displays on the left side of the button by default. Set alignIcon prop to 'right' to inverse.
 *
 * @example
 *
 * <Button label="Edit" color="secondary" onClick={doEdit}>
 *   <ContentCreate />
 * </Button>
 *
 */
const Button: FC<ButtonProps> = ({
    alignIcon = 'left',
    children,
    classes: classesOverride,
    className,
    color,
    disabled,
    label,
    size,
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles({ classes: classesOverride });
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('xs')
    );

    return isXSmall ? (
        label && !disabled ? (
            <Tooltip title={translate(label, { _: label })}>
                <IconButton
                    aria-label={translate(label, { _: label })}
                    className={className}
                    color={color}
                    {...rest}
                >
                    {children}
                </IconButton>
            </Tooltip>
        ) : (
            <IconButton
                className={className}
                color={color}
                disabled={disabled}
                {...rest}
            >
                {children}
            </IconButton>
        )
    ) : (
        <MuiButton
            className={classnames(classes.button, className)}
            color={color}
            size={size}
            aria-label={label ? translate(label, { _: label }) : undefined}
            disabled={disabled}
            {...rest}
        >
            {alignIcon === 'left' &&
                children &&
                React.cloneElement(children, {
                    className: classes[`${size}Icon`],
                })}
            {label && (
                <span
                    className={classnames({
                        [classes.label]: alignIcon === 'left',
                        [classes.labelRightIcon]: alignIcon !== 'left',
                    })}
                >
                    {translate(label, { _: label })}
                </span>
            )}
            {alignIcon === 'right' &&
                children &&
                React.cloneElement(children, {
                    className: classes[`${size}Icon`],
                })}
        </MuiButton>
    );
};

const useStyles = makeStyles(
    {
        button: {
            display: 'inline-flex',
            alignItems: 'center',
        },
        label: {
            paddingLeft: '0.5em',
        },
        labelRightIcon: {
            paddingRight: '0.5em',
        },
        smallIcon: {
            fontSize: 20,
        },
        mediumIcon: {
            fontSize: 22,
        },
        largeIcon: {
            fontSize: 24,
        },
    },
    { name: 'RaButton' }
);

interface Props {
    alignIcon?: 'left' | 'right';
    children?: ReactElement;
    classes?: object;
    className?: string;
    color?: MuiPropTypes.Color;
    disabled?: boolean;
    label?: string;
    size?: 'small' | 'medium' | 'large';
}

export type ButtonProps = Props & MuiButtonProps;

Button.propTypes = {
    alignIcon: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    disabled: PropTypes.bool,
    label: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Button.defaultProps = {
    color: 'primary',
    size: 'small',
};

export default Button;
