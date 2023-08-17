import * as React from 'react';
import { RaRecord, useTranslate, usePrevNextController } from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from 'react-router-dom';
import { CircularProgress, IconButton, SxProps, styled } from '@mui/material';
import clsx from 'clsx';
import { UsePrevNextControllerProps } from 'ra-core';

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

export const PrevNextButtons = <RecordType extends RaRecord = any>(
    props: PrevNextButtonProps<RecordType>
) => {
    const { sx } = props;

    const {
        hasPrev,
        hasNext,
        navigateToNext,
        navigateToPrev,
        index,
        total,
        error,
        isLoading,
    } = usePrevNextController<RecordType>(props);

    const translate = useTranslate();

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

    return (
        <Root sx={sx}>
            <ul className={clsx(PrevNextButtonClasses.list)}>
                <li>
                    <IconButton
                        component={hasPrev ? Link : undefined}
                        to={navigateToPrev}
                        aria-label={translate('ra.navigation.previous')}
                        disabled={!hasPrev}
                    >
                        <NavigateBefore />
                    </IconButton>
                </li>
                {typeof index === 'number' && (
                    <li>
                        {index + 1} / {total}
                    </li>
                )}
                <li>
                    <IconButton
                        component={hasNext ? Link : undefined}
                        to={navigateToNext}
                        aria-label={translate('ra.navigation.next')}
                        disabled={!hasNext}
                    >
                        <NavigateNext />
                    </IconButton>
                </li>
            </ul>
        </Root>
    );
};

export interface PrevNextButtonProps extends UsePrevNextControllerProps {
    sx?: SxProps;
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
