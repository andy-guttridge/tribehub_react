import './App.css';
import { Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar';
import TribeHome from './pages/TribeHome';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" />
        <Route exact path="/tribe-home" element={<TribeHome />} />
        <Route exact path="/contacts" element={<Contacts />} />
        <Route exact path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
