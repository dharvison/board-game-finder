import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { decodeJwt } from 'jose';
import './App.css';

import BoardGameFinderApi from './apis/bgfAPI';
import NavBar from './routes/NavBar';
import RouteList from './routes/RouteList';
import useLocalStorage from './hooks/useLocalStorage';
import UserContext from './auth/UserContext';
import { Spinner } from 'reactstrap';

// Key for localStorage
export const TOKEN_ID = "bgf-token";

/**
 * Board Game Finder App. Handles global users, login, logout
 */
function App() {
  const [token, setToken] = useLocalStorage(TOKEN_ID);
  const [currentUser, setCurrentUser] = useState({ data: null, loaded: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      if (token) {
        try {
          let { username } = decodeJwt(token);
          // API needs the token for calls
          BoardGameFinderApi.token = token;
          const user = await BoardGameFinderApi.getCurrentUser(username);
          setCurrentUser({ data: user, loaded: true });
        } catch (err) {
          console.error("Failed to load user", err);
          setCurrentUser({ data: null, loaded: false });
        }
      }
      setLoaded(true);
    }
    authUser();
  }, [token]);

  /** Handles site-wide logout. */
  const logout = () => {
    setCurrentUser({ data: null, loaded: false });
    setToken(null);
  }

  /** Handles site-wide login. */
  const login = async (loginData) => {
    try {
      const newToken = await BoardGameFinderApi.login(loginData);
      setToken(newToken);
      return { success: true }
    } catch (err) {
      console.error("login failed", err);
      return { success: false, errors: err };
    }
  }

  /** Handles site-wide signup, logs in user on success */
  const signup = async (signupData) => {
    try {
      const newToken = await BoardGameFinderApi.signup(signupData);
      setToken(newToken);
      return { success: true }
    } catch (err) {
      console.error("signup failed", err);
      return { success: false, errors: err };
    }
  }

  if (!loaded) {
    return <Spinner />
  }

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser, setCurrentUser, searchTerm, setSearchTerm }}>
          <NavBar logout={logout} />
          <main>
            <section className="col-md-8">
              <RouteList login={login} signup={signup} />
            </section>
          </main>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
