import * as React from 'react';
import { ReactNode } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslate } from 'ra-core';

/**
 * This component offers a wrapper to render children inside a FilterList
 * section.
 *
 * It basically adds a header with an icon and a label, before rendering the
 * children.
 *
 * It is used by `<FilterList>`, but can also be used standalone to make your
 * own components look nicer alongside a filter list.
 *
 * @example
 * import MailIcon from '@mui/icons-material/MailOutline';
 * import TitleIcon from '@mui/icons-material/Title';
 * import { Card, CardContent } from '@mui/material';
 * import * as React from 'react';
 * import {
 *     FilterLiveForm,
 *     FilterList,
 *     FilterListItem,
 *     FilterListSection,
 *     TextInput,
 * } from 'react-admin';
 *
 * export const BookListAside = () => (
 *     <Card sx={{ order: -1, mr: 2, mt: 6, width: 250, height: 'fit-content' }}>
 *         <CardContent>
 *             <FilterList label="Subscribed to newsletter" icon={<MailIcon />}>
 *                 <FilterListItem label="Yes" value={{ has_newsletter: true }} />
 *                 <FilterListItem label="No" value={{ has_newsletter: false }} />
 *             </FilterList>
 *             <FilterListSection label="Title" icon={<TitleIcon />}>
 *                 <FilterLiveForm>
 *                     <TextInput source="title" resettable helperText={false} />
 *                 </FilterLiveForm>
 *             </FilterListSection>
 *         </CardContent>
 *     </Card>
 * );
 */
export const FilterListSection = (props: FilterListSectionProps) => {
    const { label, icon, children, ...rest } = props;
    const translate = useTranslate();
    return (
        <Box {...rest}>
            <Box mt={2} display="flex" alignItems="center">
                <Box mr={1} lineHeight="initial">
                    {icon}
                </Box>
                <Typography variant="overline">
                    {translate(label, { _: label })}
                </Typography>
            </Box>
            {children}
        </Box>
    );
};

export interface FilterListSectionProps extends BoxProps {
    label: string;
    icon: ReactNode;
}
