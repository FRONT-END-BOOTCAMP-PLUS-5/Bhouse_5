'use client';

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";

import { CustomContextProvider } from "@/context/CustomContext";
import store from "@/store/store";
import GlobalLoader from "@/modals/globalLoader";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <CustomContextProvider>
        <QueryClientProvider client={queryClient}>
          <GlobalLoader/>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CustomContextProvider>
    </Provider>
  );
};