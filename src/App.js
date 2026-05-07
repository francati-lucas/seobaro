import './App.css';
import Home from './pages/Home';
import Pedido from './pages/Pedido';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/pedido"
          element={
            <RequireAuth>
              <Pedido />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
