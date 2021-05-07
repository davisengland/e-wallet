import './App.css';
// import Header from './components/Header'
import Profile from './components/Profile'
import Overview from './components/Overview'
import Routes from './Routes'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  return (
    <div>
        {!isLoading ? Routes : null}
    </div>
  );
}

export default App;
