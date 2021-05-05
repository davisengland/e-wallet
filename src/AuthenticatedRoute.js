import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAuth0();
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={
          `/landing`
        } />
      )}
    </Route>
  );
}