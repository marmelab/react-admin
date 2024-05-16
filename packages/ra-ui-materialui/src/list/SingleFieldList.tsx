import * as React from 'react';
import { Chip, Stack, StackProps, styled } from '@mui/material';
import {
    sanitizeListRestProps,
    useListContextWithProps,
    useResourceContext,
    RaRecord,
    RecordContextProvider,
    RecordRepresentation,
    useCreatePath,
} from 'ra-core';

import { LinearProgress } from '../layout/LinearProgress';
import { Link } from '../Link';

/**
 * Iterator component to be used to display a list of entities, using a single field
 *
 * @example Display all the orders by the current customer as a list of chips
 * <ReferenceManyField reference="orders" target="customer_id">
 *     <SingleFieldList />
 * </ReferenceManyField>

* @example Choose the field to be used as text label
 * <ReferenceManyField reference="orders" target="customer_id">
 *     <SingleFieldList>
 *         <ChipField source="reference" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * @example Customize the link type
 * // By default, it includes a link to the <Edit> page of the related record
 * // (`/orders/:id` in the previous example).
 * // Set the linkType prop to "show" to link to the <Show> page instead.
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList linkType="show">
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * @example Disable the link
 * // You can also prevent `<SingleFieldList>` from adding link to children by
 * // setting `linkType` to false.
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
        empty,
        linkType = 'edit',
        gap = 1,
        direction = 'row',
        ...rest
    } = props;
    const { data, total, isPending } = useListContextWithProps(props);
    const resource = useResourceContext(props);
    const createPath = useCreatePath();

    if (isPending === true) {
        return <LinearProgress />;
    }

    if (data == null || data.length === 0 || total === 0) {
        if (empty) {
            return empty;
        }

        return null;
    }

    return (
        <Root
            gap={gap}
            direction={direction}
            className={className}
            {...sanitizeListRestProps(rest)}
        >
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
                                {children || (
                                    <DefaultChildComponent clickable />
                                )}
                            </Link>
                        </RecordContextProvider>
                    );
                }

                return (
                    <RecordContextProvider
                        value={record}
                        key={record.id ?? `row${rowIndex}`}
                    >
                        {children || <DefaultChildComponent />}
                    </RecordContextProvider>
                );
            })}
        </Root>
    );
};

export interface SingleFieldListProps<RecordType extends RaRecord = any>
    extends StackProps {
    className?: string;
    empty?: React.ReactElement;
    linkType?: string | false;
    children?: React.ReactNode;
    // can be injected when using the component without context
    data?: RecordType[];
    total?: number;
    loaded?: boolean;
}

const PREFIX = 'RaSingleFieldList';

export const SingleFieldListClasses = {
    link: `${PREFIX}-link`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
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

const DefaultChildComponent = ({ clickable }: { clickable?: boolean }) => (
    <Chip
        sx={{ cursor: 'inherit' }}
        size="small"
        label={<RecordRepresentation />}
        clickable={clickable}
    />
);
