import * as React from 'react';
import { LinearProgress, styled, SxProps } from '@mui/material';
import {
    cloneElement,
    Children,
    HtmlHTMLAttributes,
    ComponentType,
} from 'react';
import PropTypes from 'prop-types';
import {
    sanitizeListRestProps,
    useListContext,
    useResourceContext,
    RaRecord,
    RecordContextProvider,
    ComponentPropType,
    useCreatePath,
} from 'ra-core';

import { Link } from '../Link';

/**
 * Iterator component to be used to display a list of entities, using a single field
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, it includes a link to the <Edit> page of the related record
 * (`/books/:id` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList linkType="show">
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * You can also prevent `<SingleFieldList>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList linkType={false}>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 */
export const SingleFieldList = (props: SingleFieldListProps) => {
    const {
        className,
        children,
        linkType = 'edit',
        component: Component = Root,
        ...rest
    } = props;
    const { data, isLoading } = useListContext(props);
    const resource = useResourceContext(props);
    const createPath = useCreatePath();

    if (isLoading === true) {
        return <LinearProgress />;
    }

    return (
        <Component className={className} {...sanitizeListRestProps(rest)}>
            {data.map((record, rowIndex) => {
                const resourceLinkPath = !linkType
                    ? false
                    : createPath({
                          resource,
                          type: linkType,
                          id: record.id,
                      });

                if (resourceLinkPath) {
                    return (
                        <RecordContextProvider
                            value={record}
                            key={record.id ?? `row${rowIndex}`}
                        >
                            <Link
                                className={SingleFieldListClasses.link}
                                to={resourceLinkPath}
                                onClick={stopPropagation}
                            >
                                {cloneElement(Children.only(children), {
                                    record,
                                    resource,
                                    // Workaround to force ChipField to be clickable
                                    onClick: handleClick,
                                })}
                            </Link>
                        </RecordContextProvider>
                    );
                }

                return (
                    <RecordContextProvider
                        value={record}
                        key={record.id ?? `row${rowIndex}`}
                    >
                        {children}
                    </RecordContextProvider>
                );
            })}
        </Component>
    );
};

SingleFieldList.propTypes = {
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    component: ComponentPropType,
    data: PropTypes.any,
    ids: PropTypes.array,
    // @ts-ignore
    linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.object,
                PropTypes.bool,
            ])
        ),
        PropTypes.func,
        PropTypes.object,
    ]),
};

export interface SingleFieldListProps<RecordType extends RaRecord = any>
    extends HtmlHTMLAttributes<HTMLDivElement> {
    className?: string;

    component?: string | ComponentType<any>;
    linkType?: string | false;
    children: React.ReactElement;
    // can be injected when using the component without context
    data?: RecordType[];
    total?: number;
    loaded?: boolean;
    sx?: SxProps;
}

const PREFIX = 'RaSingleFieldList';

export const SingleFieldListClasses = {
    link: `${PREFIX}-link`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',

    [`& .${SingleFieldListClasses.link}`]: {
        textDecoration: 'none',
        '& > *': {
            color: theme.palette.primary.main,
        },
    },
}));

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from Material UI.
// The Material UI Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};
