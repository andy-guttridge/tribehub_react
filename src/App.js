import './App.css';
import { Route, Routes } from 'react-router-dom';

import TribeHome from './pages/TribeHome';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
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
