import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toast } from './utils/toast';
import client from './utils/apolloClient';
import { ApolloProvider } from '@apollo/client';

function App() {
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