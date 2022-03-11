import * as React from 'react';
import { ReactNode } from 'react';
import { Box, Typography, List, styled, SxProps } from '@mui/material';
import { useTranslate } from 'ra-core';

/**
 * Header and container for a list of filter list items
 *
 * Expects 2 props, and a list of <FilterListItem> as children:
 *
 * - label: The label for this filter section. Will be translated.
 * - icon: An icon react element
 *
 * @see FilterListItem
 *
 * @example
 *
 * import * as React from 'react';
 * import { Card, CardContent } from '@mui/material';
 * import MailIcon from '@mui/icons-material/MailOutline';
 * import { FilterList, FilterListItem } from 'react-admin';
 *
 * const FilterSidebar = () => (
 *     <Card>
 *         <CardContent>
 *             <FilterList
 *                 label="Subscribed to newsletter"
 *                 icon={<MailIcon />}
 *             >
 *                 <FilterListItem
 *                     label="Yes"
 *                     value={{ has_newsletter: true }}
 *                  />
 *                 <FilterListItem
 *                     label="No"
 *                     value={{ has_newsletter: false }}
 *                  />
 *             </FilterList>
 *         </CardContent>
 *     </Card>
 * );
 */
export const FilterList = (props: FilterListProps) => {
    const { label, icon, children, className, sx } = props;
    const translate = useTranslate();
    return (
        <Root className={className} sx={sx}>
            <Box mt={2} display="flex" alignItems="center">
                <Box mr={1}>{icon}</Box>
                <Typography variant="overline">{translate(label)}</Typography>
            </Box>
            <List dense disablePadding>
                {children}
            </List>
        </Root>
    );
};

const Root = styled('div', {
    name: 'RaFilterList',
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

export interface FilterListProps {
    label: string;
    icon: ReactNode;
    children: ReactNode;
    className?: string;
    sx?: SxProps;
}
