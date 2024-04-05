import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllTodosPage from './pages/AllTodos';
import NotFoundPage from './pages/NotFound';
import SingleTodoPage from './pages/SingleTodo';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllTodosPage />} />
        <Route path="/singleTodo" element={<SingleTodoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
