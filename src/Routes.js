import { Switch } from "react-router-dom";
import Overview from "./components/Overview";
import Month from "./components/Month";
import Profile from "./components/Profile";
import AuthenticatedRoute from './AuthenticatedRoute'
import UnauthenticatedRoute from './UnauthenticatedRoute'
import Landing from './components/Landing'

export default (
  <Switch>
    <AuthenticatedRoute exact path="/">
        <Overview/>
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/month">
        <Month/>
    </AuthenticatedRoute>
    {/* <AuthenticatedRoute path="/settings">
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
