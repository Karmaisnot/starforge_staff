import { useContext } from 'react';
import { ServicesContext } from '@/app/providers/ServicesProvider.jsx';

/** Access the injected service registry. */
export function useServices() {
  return useContext(ServicesContext);
}
