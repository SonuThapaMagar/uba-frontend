import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toast } from './utils/toast';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { initClient } from './utils/apolloClient';

function App() {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    initClient().then(setClient);
  }, []);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AppRoutes />
        <Toast />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;