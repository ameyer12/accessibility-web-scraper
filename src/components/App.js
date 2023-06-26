import { Routes, Route } from 'react-router-dom';
import './app.css';
import { Home } from '.';

function App() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home />}></Route>
        </Routes>
    </div>
  );
}

export default App;
