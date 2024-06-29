import logo from './logo.svg';
import MakerForm from './components/MakerForm/MakerForm.jsx'
import './App.css';
import Header from './components/Header/Header.jsx';
import CheckerForm from './components/CheckerForm/CheckerForm.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/reportissue" element={<MakerForm />} />
          <Route path="/maker-form" element={<MakerForm />} />
          <Route path="/checker-form" element={<CheckerForm />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
