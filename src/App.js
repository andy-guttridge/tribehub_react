import './App.css';
import { Route, Routes } from 'react-router-dom';

import './api/axiosDefaults'
import Signin from './pages/Signin'
import TribeHome from './pages/TribeHome';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import Header from './components/Header';
import { useCurrentUser } from './contexts/CurrentUserContext';
import Landing from './pages/Landing';

function App() {
  const currentUser = useCurrentUser();
  return (
    <div className="App">
      <Header />
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Landing />}/>
        <Route exact path="sign-in" element={<Signin />}/>
        <Route exact path="/tribe-home" element={<TribeHome />} />
        <Route exact path="/contacts" element={<Contacts />} />
        <Route exact path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
