import type { ReactNode } from "react";
import { Layout as RALayout } from "react-admin";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </RALayout>
);
