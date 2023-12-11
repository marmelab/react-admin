
import { Layout as LayoutRA, LayoutProps, CheckForApplicationUpdate } from 'react-admin';

export const Layout = ({ children, ...props }: LayoutProps) => (
  <LayoutRA {...props}>
    {children}
    <CheckForApplicationUpdate />
  </LayoutRA>
);
