import { I18nProvider } from './I18nProvider.jsx';
import { ThemeProvider } from './ThemeProvider.jsx';
import { ServicesProvider } from './ServicesProvider.jsx';
import { ToastProvider } from './ToastProvider.jsx';

/** Composes the cross-cutting providers around the app tree. */
export function AppProviders({ children }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ServicesProvider>
          <ToastProvider>{children}</ToastProvider>
        </ServicesProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
