import { Switch, Route } from "react-router-dom";
import Overview from "./components/Overview";
import Month from "./components/Month";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AuthenticatedRoute from './AuthenticatedRoute'
import UnauthenticatedRoute from './UnauthenticatedRoute'
import Landing from './components/Landing'

export default (
  <Switch>
    <AuthenticatedRoute exact path="/">
        <Overview/>
    </AuthenticatedRoute>
    {/* <AuthenticatedRoute path="/month">
        <Month/>
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/settings">
        <Settings/>
    </AuthenticatedRoute> */}
    <AuthenticatedRoute path="/profile">
        <Profile/>
    </AuthenticatedRoute>
    <UnauthenticatedRoute path="/landing">
        <Landing/>
    </UnauthenticatedRoute>
  </Switch>
);
