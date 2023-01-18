import './App.css';
import { Route, Routes } from 'react-router-dom';

import NavBar from './components/BottomNavBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" />
      </Routes>
    </div>
  );
}

export default App;
