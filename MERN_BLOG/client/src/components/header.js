import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../usercontext';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:5000/profile', {
      credentials: 'include'
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    });

    setUserInfo(null);
  }

  const username = userInfo?.username;
  return (
    <header>
      <Link
        to="/"
        className="logo">
        My Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <a
              href=" "
              onClick={logout}>
              {' '}
              Logout
            </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Regsiter</Link>
          </>
        )}
      </nav>
    </header>
  );
}
