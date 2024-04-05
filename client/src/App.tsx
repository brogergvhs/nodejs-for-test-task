import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllTodosPage from './pages/AllTodos';
import AboutPage from './pages/About';
import NotFoundPage from './pages/NotFound';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllTodosPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
