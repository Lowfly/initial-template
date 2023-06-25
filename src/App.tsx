import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import MyRouter from "routers/index";

function App() {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: { refetchOnWindowFocus: false, retry: false },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <MyRouter />
      </div>
    </QueryClientProvider>
  );
}

export default App;
