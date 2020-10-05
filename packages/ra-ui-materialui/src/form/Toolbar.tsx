import * as React from 'react';
import {
    Children,
    Fragment,
    isValidElement,
    ReactElement,
    FC,
    ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import MuiToolbar from '@material-ui/core/Toolbar';
import withWidth from '@material-ui/core/withWidth';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { SaveButton, DeleteButton } from '../button';
import { Record, RedirectionSideEffect } from 'ra-core';
import { FormRenderProps } from 'react-final-form';
import { ClassesOverride } from '../types';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            backgroundColor:
                theme.palette.type === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
        },
        desktopToolbar: {
            marginTop: theme.spacing(2),
        },
        mobileToolbar: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            width: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
            zIndex: 2,
        },
        defaultToolbar: {
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
        },
        spacer: {
            [theme.breakpoints.down('xs')]: {
                height: '5em',
            },
        },
    }),
    { name: 'RaToolbar' }
);

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;

/**
 * The Toolbar displayed at the bottom of forms.
 *
 * @example Always enable the <SaveButton />
 *
 * import * as React from 'react';
 * import {
 *     Create,
 *     DateInput,
 *     TextInput,
 *     SimpleForm,
 *     Toolbar,
 *     required,
 * } from 'react-admin';
 *
 * const now = new Date();
 * const defaultSort = { field: 'title', order: 'ASC' };
 *
 * const CommentCreate = props => (
 *     <Create {...props}>
 *         <SimpleForm redirect={false} toolbar={<Toolbar alwaysEnableSaveButton={true} />}>
 *             <TextInput
 *                 source="author.name"
 *                 fullWidth
 *             />
 *             <DateInput source="created_at" defaultValue={now} />
 *             <TextInput source="body" fullWidth={true} multiline={true} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by the <SimpleForm>)
 * @prop {boolean} alwaysEnableSaveButton Force enabling the <SaveButton>. It it's not defined, the <SaveButton> will be enabled using the `pristine` prop (disabled if pristine, enabled otherwise).
 * @prop {ReactElement[]} children Customize the buttons you want to display in the <Toolbar>.
 * @prop {string} width Apply the mobile or the desktop classes depending on the width. Pass "xs" to display the mobile version.
 *
 */
const Toolbar: FC<ToolbarProps> = props => {
    const {
        alwaysEnableSaveButton,
        basePath,
        children,
        className,
        classes: classesOverride,
        handleSubmit,
        handleSubmitWithRedirect,
        invalid,
        pristine,
        record,
        redirect,
        resource,
        saving,
        submitOnEnter,
        undoable,
        width,
        ...rest
    } = props;
    const classes = useStyles(props);

    // Use form pristine to enable or disable the save button
    // if alwaysEnableSaveButton is undefined
    const disabled = !valueOrDefault(alwaysEnableSaveButton, !pristine);

    return (
        <Fragment>
            <MuiToolbar
                className={classnames(
                    classes.toolbar,
                    {
                        [classes.mobileToolbar]: width === 'xs',
                        [classes.desktopToolbar]: width !== 'xs',
                    },
                    className
                )}
                role="toolbar"
                {...rest}
            >
                {Children.count(children) === 0 ? (
                    <div className={classes.defaultToolbar}>
                        <SaveButton
                            handleSubmitWithRedirect={
                                handleSubmitWithRedirect || handleSubmit
                            }
                            disabled={disabled}
                            invalid={invalid}
                            redirect={redirect}
                            saving={saving}
                            submitOnEnter={submitOnEnter}
                        />
                        {record && typeof record.id !== 'undefined' && (
                            <DeleteButton
                                basePath={basePath}
                                record={record}
                                resource={resource}
                                undoable={undoable}
                            />
                        )}
                    </div>
                ) : (
                    Children.map(children, (button: ReactElement) =>
                        button && isValidElement<any>(button)
                            ? React.cloneElement(button, {
                                  basePath,
                                  handleSubmit: valueOrDefault(
                                      button.props.handleSubmit,
                                      handleSubmit
                                  ),
                                  handleSubmitWithRedirect: valueOrDefault(
                                      button.props.handleSubmitWithRedirect,
                                      handleSubmitWithRedirect
                                  ),
                                  onSave: button.props.onSave,
                                  invalid,
                                  pristine,
                                  record,
                                  resource,
                                  saving,
                                  submitOnEnter: valueOrDefault(
                                      button.props.submitOnEnter,
                                      submitOnEnter
                                  ),
                                  undoable: valueOrDefault(
                                      button.props.undoable,
                                      undoable
                                  ),
                              })
                            : null
                    )
                )}
            </MuiToolbar>
            <div className={classes.spacer} />
        </Fragment>
    );
};

export interface ToolbarProps<RecordType extends Record = Record> {
    children?: ReactNode;
    alwaysEnableSaveButton?: boolean;
    className?: string;
    classes?: ClassesOverride<typeof useStyles>;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    handleSubmit?: FormRenderProps['handleSubmit'];
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    redirect?: RedirectionSideEffect;
    basePath?: string;
    record?: RecordType;
    resource?: string;
    undoable?: boolean;
    width?: string;
}

Toolbar.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    handleSubmit: PropTypes.func,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    undoable: PropTypes.bool,
    width: PropTypes.string,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
};

export default withWidth({ initialWidth: 'xs' })(Toolbar);
