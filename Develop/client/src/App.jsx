import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import './App.css';
import Navbar from './components/Navbar';
import { Outlet } from "react-router-dom"
// Set up the Apollo Client
const httpLink = createHttpLink({
  uri: '/graphql', // Change this to the URI of your GraphQL server if it's different
});

const authLink = setContext((_, { headers }) => {
  // Get the token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so that httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
      {/* Your app's routes will be managed by main.jsx now, so no Routes here */}
      {/* You can place components here that should render on every page */}
    </ApolloProvider>
  );
}

export default App;
