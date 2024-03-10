import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../usercontext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  async function Login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        navigate('/');
      });
    } else {
      alert('wrong credentials');
    }
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
