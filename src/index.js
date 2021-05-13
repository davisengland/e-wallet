import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react'
import { ApolloProvider } from '@apollo/client/react'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux'
import store from './redux/store'
import { HashRouter, BrowserRouter } from "react-router-dom";
const Router = process.env.NODE_ENV === 'development' ? HashRouter : BrowserRouter

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const client = new ApolloClient({uri:'http://localhost:4000/graphql', cache: new InMemoryCache()})

ReactDOM.render(
  <Provider store={store}>
    <Auth0Provider 
      domain={domain}
      clientId={clientId}
      redirectUri={'https://www.e-wallet.us'}>
      <ApolloProvider client={client}>
        <Router>
          <App />
        </Router>
      </ApolloProvider>
    </Auth0Provider>
  </Provider>,
  document.getElementById('root')
);