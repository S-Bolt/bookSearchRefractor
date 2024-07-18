import './App.css';
import { Outlet } from 'react-router-dom';
// Appollo imports
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';
//Constructing GraphQl Api endpoint
const httpLink = createHttpLink({
  uri: '/graphql',//endpoint
});
//Middleware to attach JWT token to authorization header
const authLink = setContext((_, { headers }) =>{
  const token = localStorage.getItem('id_token');
  //return headers to context so httpLink can read
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
//client excutes authlink middleware before requesting GraphQl Api
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
    <>
      <Navbar />
      <Outlet />
    </>
    </ApolloProvider>
  );
}

export default App;
