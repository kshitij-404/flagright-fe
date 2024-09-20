import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TransactionInventory } from './components/TransactionInventory/TransactionInventory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TransactionInventory />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
