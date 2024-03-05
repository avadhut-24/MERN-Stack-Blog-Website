import Header from './header';
import { Outlet } from 'react-router-dom';

export default function layout() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
