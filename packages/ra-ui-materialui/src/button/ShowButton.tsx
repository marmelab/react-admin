import * as React from 'react';
import { memo, useMemo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';
import { linkToRecord, Record, useResourceContext } from 'ra-core';

import Button, { ButtonProps } from './Button';

/**
 * Opens the Show view of a given record
 *
 * @example // basic usage
 * import { ShowButton } from 'react-admin';
 *
 * const CommentShowButton = ({ record }) => (
 *     <ShowButton basePath="/comments" label="Show comment" record={record} />
 * );
 */
const ShowButton = (props: ShowButtonProps) => {
    const {
        basePath = '',
        icon = defaultIcon,
        label = 'ra.action.show',
        record,
        scrollToTop = true,
        ...rest
    } = props;
    const resource = useResourceContext();
    return (
        <Button
            component={Link}
            to={useMemo(
                () => ({
                    pathname: record
                        ? `${linkToRecord(
                              basePath || `/${resource}`,
                              record.id
                          )}/show`
                        : '',
                    state: { _scrollToTop: scrollToTop },
                }),
                [basePath, record, resource, scrollToTop]
            )}
            label={label}
            onClick={stopPropagation}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ImageEye />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

interface Props {
    basePath?: string;
    icon?: ReactElement;
    label?: string;
    record?: Record;
    scrollToTop?: boolean;
}

export type ShowButtonProps = Props & ButtonProps;

ShowButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
    scrollToTop: PropTypes.bool,
};

const PureShowButton = memo(
    ShowButton,
    (props: ShowButtonProps, nextProps: ShowButtonProps) =>
        (props.record && nextProps.record
            ? props.record.id === nextProps.record.id
            : props.record == nextProps.record) && // eslint-disable-line eqeqeq
        props.basePath === nextProps.basePath &&
        props.to === nextProps.to &&
        props.disabled === nextProps.disabled
);

export default PureShowButton;
