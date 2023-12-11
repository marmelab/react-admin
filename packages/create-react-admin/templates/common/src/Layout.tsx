import {
  Layout as RALayout,
  LayoutProps,
  CheckForApplicationUpdate,
} from "react-admin";

export const Layout = ({ children, ...props }: LayoutProps) => (
  <RALayout {...props}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
