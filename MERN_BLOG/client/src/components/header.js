import { Link } from 'react-router-dom';

export default function header() {
  return (
    <header>
      <Link
        to="/"
        className="logo">
        My Blog
      </Link>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Regsiter</Link>
      </nav>
    </header>
  );
}
