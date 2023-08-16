import * as React from 'react';
import {
    FilterPayload,
    ListParams,
    SORT_ASC,
    SortPayload,
    useCreatePath,
    useGetList,
    useRecordContext,
    useResourceContext,
    useStore,
    useTranslate,
} from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from 'react-router-dom';
import { CircularProgress, IconButton, SxProps, styled } from '@mui/material';
import clsx from 'clsx';

/**
 * A component used to render the previous and next buttons in a Show or Edit view.
 *
 * The `<PrevNextButtons>` component render a navigation to move to the next or previous record
 * of a resource, with the current index and the total records, in an edit or show view.
 *
 * It fetches the list of records from the REST API according to the filters
 * and the sort order configured in the lists by the users and
 * also merges the filters and the sorting order passed into props.
 *
 * `<PrevNextButtons>` can be used anywhere a record context is provided
 * (eg: often inside a `<Show>` or `<Edit>` component).
 *
 * @example // move to edit view by default
 * <ShowButton />
 *
 * @example // move to show view
 * <PrevNextButtons linkType="show" />
 *
 * @example // share custom storeKey with other components
 * <PrevNextButtons storeKey="listStoreKey" />
 *
 * @example // limit the number of records to fetch
 * <PrevNextButtons limit={500} />
 *
 * @example // customize filters and sort order
 * <PrevNextButtons
 *     linkType="show"
 *     sort={{
 *         field: 'first_name',
 *         order: 'DESC',
 *     }}
 *     filter={{ q: 'East a' }}
 * />
 *
 * @example // customize its style
 * <PrevNextButtons
 *     sx={{
 *         color: 'blue',
 *         '& .RaPrevNextButton-list': {
 *             marginBottom: '20px',
 *             color: 'red',
 *         },
 *     }}
 * />
 *
 * @example // in an edit view
 * import * as React from "react";
 * import { Edit, PrevNextButtons, ShowButton, SimpleForm, TopToolbar } from 'react-admin';
 *
 * const MyTopToolbar = ({ children }) => (
 *     <TopToolbar>
 *         {children}
 *     </TopToolbar>
 * );
 *
 * export const PostEdit = () => (
 *      <Edit
 *          actions={
 *              <MyTopToolbar>
 *                  <PrevNextButtons
 *                      sort={{
 *                          field: 'first_name',
 *                          order: 'DESC',
 *                      }}
 *                      filter={{ q: 'East a' }}
 *                  />
 *                  <ShowButton />
 *              </MyTopToolbar>
 *          }
 *      >
 *          <SimpleForm>...</SimpleForm>
 *      </Edit>
 * );
 */

export const PrevNextButtons = (props: PrevNextButtonProps) => {
    const {
        linkType = 'edit',
        sx,
        storeKey,
        limit = 1000,
        staleTime = 5 * 60 * 1000,
        sort = { field: 'id', order: SORT_ASC },
        filter = {},
    } = props;

    const record = useRecordContext();
    const resource = useResourceContext();

    const [storedParams] = useStore<StoredParams>(
        storeKey || `${resource}.listParams`,
        {
            filter,
            order: sort.order,
            sort: sort.field,
        }
    );

    const { data, error, isLoading } = useGetList(
        resource,
        {
            sort: {
                ...{ field: storedParams.sort, order: storedParams.order },
                ...sort,
            },
            filter: { ...storedParams.filter, ...filter },
            pagination: { page: 1, perPage: limit },
        },
        { staleTime }
    );

    if (!record) return null;

    if (isLoading) {
        return <CircularProgress size={14} />;
    }
    if (error) {
        return (
            <ErrorIcon
                color="error"
                fontSize="small"
                titleAccess="error"
                aria-errormessage={error.message}
            />
        );
    }

    const ids = data ? data.map(record => record.id) : [];

    const index = ids.indexOf(record.id);

    return (
        <Root sx={sx}>
            <ul className={clsx(PrevNextButtonClasses.list)}>
                <li>
                    <PrevButton
                        ids={ids}
                        currentIndex={index}
                        linkType={linkType}
                        resource={resource}
                    />
                </li>
                {index !== -1 && (
                    <li>
                        {index + 1} / {data.length}
                    </li>
                )}
                <li>
                    <NextButton
                        ids={ids}
                        currentIndex={index}
                        linkType={linkType}
                        resource={resource}
                    />
                </li>
            </ul>
        </Root>
    );
};

const PrevButton = ({ ids, currentIndex, linkType, resource }: ButtonProps) => {
    const translate = useTranslate();
    const createPath = useCreatePath();

    const previousId =
        typeof ids[currentIndex - 1] !== 'undefined'
            ? ids[currentIndex - 1]
            : null; // could be 0

    return (
        <IconButton
            component={previousId !== null ? Link : undefined}
            to={
                previousId !== null
                    ? createPath({
                          type: linkType,
                          resource,
                          id: previousId,
                      })
                    : undefined
            }
            aria-label={translate('ra.navigation.previous')}
            disabled={previousId !== null ? false : true}
        >
            <NavigateBefore />
        </IconButton>
    );
};

const NextButton = ({ ids, currentIndex, linkType, resource }: ButtonProps) => {
    const translate = useTranslate();
    const createPath = useCreatePath();

    const nextId =
        currentIndex !== -1 && currentIndex < ids.length - 1
            ? ids[currentIndex + 1]
            : null;

    return (
        <IconButton
            component={nextId !== null ? Link : undefined}
            to={
                nextId !== null
                    ? createPath({
                          type: linkType,
                          resource,
                          id: nextId,
                      })
                    : undefined
            }
            aria-label={translate('ra.navigation.next')}
            disabled={nextId !== null ? false : true}
        >
            <NavigateNext />
        </IconButton>
    );
};

interface ButtonProps {
    ids: any[];
    currentIndex: number;
    linkType: 'edit' | 'show';
    resource: string;
}

export interface PrevNextButtonProps {
    linkType?: 'edit' | 'show';
    sx?: SxProps;
    storeKey?: string | false;
    limit?: number;
    staleTime?: number;
    filter?: FilterPayload;
    sort?: SortPayload;
}

const PREFIX = 'RaPrevNextButton';

export const PrevNextButtonClasses = {
    list: `${PREFIX}-list`,
};

const Root = styled('nav', {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})({
    [`& .${PrevNextButtonClasses.list}`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        listStyle: 'none',
    },
});

type StoredParams = Pick<ListParams, 'filter' | 'order' | 'sort'>;
