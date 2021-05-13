import './App.css';
import Routes from './Routes'
import { useAuth0 } from '@auth0/auth0-react'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const { isLoading } = useAuth0()

  return (
    <div className='app'>
        {!isLoading ? Routes : null}
    </div>
  );
}

export default App;
