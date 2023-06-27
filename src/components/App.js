import { Routes, Route } from 'react-router-dom';
import './app.css';
import { Home, Navbar } from '.';

function App() {
  return (
    <div>
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />}></Route>
        </Routes>
    </div>
  );
}

export default App;
