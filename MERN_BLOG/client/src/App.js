import './App.css';
import Layout from './components/layout';
import IndexPage from './pages/index';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import { Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './usercontext';
import CreatePostPage from './pages/createPostPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route
          path="/"
          element={<Layout />}>
          <Route
            path="/"
            element={<IndexPage />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/create"
            element={<CreatePostPage />}
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
