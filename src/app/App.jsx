import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { ThemeSwitcher } from '@/layout/ThemeSwitcher.jsx';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ThemeSwitcher />
    </>
  );
}
