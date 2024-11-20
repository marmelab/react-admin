import { BoxProps, List } from '@mui/material';
import * as React from 'react';
import { ReactNode } from 'react';
import { FilterListSection } from './FilterListSection';

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
    const { children, ...rest } = props;
    return (
        <FilterListSection {...rest}>
            <List dense disablePadding>
                {children}
            </List>
        </FilterListSection>
    );
};

export interface FilterListProps extends BoxProps {
    label: string;
    icon: ReactNode;
}
