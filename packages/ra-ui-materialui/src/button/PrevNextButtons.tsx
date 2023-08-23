import * as React from 'react';
import {
    RaRecord,
    useTranslate,
    usePrevNextController,
    UsePrevNextControllerProps,
} from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from 'react-router-dom';
import { Box, IconButton, SxProps, styled } from '@mui/material';
import clsx from 'clsx';

import { LinearProgress } from '../layout/LinearProgress';

/**
 * A component used to render the previous and next buttons in a Show or Edit view.
 *
 * The `<PrevNextButtons>` component renders navigation buttons linking to
 * the next and previous records of the current resource, the current index
 * and the total number of records.
 *
 * It uses usePrevNextController to fetch the list of records.
 *
 * `<PrevNextButtons>` can be used anywhere a record context is provided
 * (often inside a `<Show>` or `<Edit>` component).
 *
 * @example <caption>navigate to edit view by default</caption>
 * <ShowButton />
 *
 * @example <caption>navigate to show view</caption>
 * <PrevNextButtons linkType="show" />
 *
 * @example <caption>custom storeKey</caption>
 * <PrevNextButtons storeKey="listStoreKey" />
 *
 * @example <caption>limit the number of records to fetch</caption>
 * <PrevNextButtons limit={500} />
 *
 * @example <caption>customize filters and sort order</caption>
 * <PrevNextButtons
 *     linkType="show"
 *     sort={{
 *         field: 'first_name',
 *         order: 'DESC',
 *     }}
 *     filter={{ q: 'East a' }}
 * />
 *
 * @example <caption>customize style</caption>
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
 * @example <caption>in an edit view</caption>
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
        prevPath,
        nextPath,
        index,
        total,
        error,
        isLoading,
    } = usePrevNextController<RecordType>(props);

    const translate = useTranslate();

    if (isLoading) {
        return (
            <Box minHeight={theme => theme.spacing(4)}>
                <LinearProgress />
            </Box>
        );
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
    if (!hasPrev && !hasNext) {
        return <Box minHeight={theme => theme.spacing(5)} />;
    }

    return (
        <Root sx={sx}>
            <ul className={clsx(PrevNextButtonClasses.list)}>
                <li>
                    <IconButton
                        component={hasPrev ? Link : undefined}
                        to={prevPath}
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
                        to={nextPath}
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

export interface PrevNextButtonProps<RecordType extends RaRecord = any>
    extends UsePrevNextControllerProps<RecordType> {
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
