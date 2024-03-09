import { useState } from 'react';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const [redirect, setRedirect] = useState(false);

  async function Login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      // setRedirect(true);
      navigate('/');
    } else {
      alert('wrong credentials');
    }

    // if (redirect) {
    //   console.log('check');
    //   return <Navigate to="/" />;
    // }
  }

  return (
    <form
      className="login"
      onSubmit={Login}>
      <h1> Login</h1>
      <input
        type="text"
        value={username}
        placeholder="username"
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button> Login</button>
    </form>
  );
}
