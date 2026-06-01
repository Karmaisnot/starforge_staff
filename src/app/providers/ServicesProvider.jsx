import { createContext } from 'react';
import { services as defaultServices } from '@/services/container.js';

/** Dependency-injection context carrying the service registry. */
export const ServicesContext = createContext(defaultServices);

/**
 * Injects the service container. Tests can pass a fake `value`.
 * @param {{ value?: object, children: any }} props
 */
export function ServicesProvider({ value = defaultServices, children }) {
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}
