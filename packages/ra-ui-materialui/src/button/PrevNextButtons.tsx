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
import {
    Box,
    Stack,
    Typography,
    IconButton,
    SxProps,
    styled,
} from '@mui/material';
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
            <Box minHeight={34} display="flex" alignItems="center">
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
        return <Box minHeight={34} />;
    }

    return (
        <Root
            sx={sx}
            role="navigation"
            direction="row"
            className={clsx(PrevNextButtonClasses.root)}
        >
            <IconButton
                component={hasPrev ? Link : undefined}
                to={prevPath}
                aria-label={translate('ra.navigation.previous')}
                disabled={!hasPrev}
                size="small"
            >
                <NavigateBefore />
            </IconButton>

            {typeof index === 'number' && (
                <Typography variant="body2">
                    {index + 1} / {total}
                </Typography>
            )}

            <IconButton
                component={hasNext ? Link : undefined}
                to={nextPath}
                aria-label={translate('ra.navigation.next')}
                disabled={!hasNext}
                size="small"
            >
                <NavigateNext />
            </IconButton>
        </Root>
    );
};

export interface PrevNextButtonProps<RecordType extends RaRecord = any>
    extends UsePrevNextControllerProps<RecordType> {
    sx?: SxProps;
}

const PREFIX = 'RaPrevNextButton';

export const PrevNextButtonClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5em',
});
