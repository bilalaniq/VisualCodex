// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import FrontPage from './components/FrontPage';
import AlgorithmListPage from './pages/AlgorithmListPage';
import AboutPage from './pages/AboutPage';
import StackArray from './pages/Algorithms/StackArray';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Menu />
        <main>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/algorithms" element={<AlgorithmListPage />} />
            <Route path="/stack-array" element={<StackArray />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;