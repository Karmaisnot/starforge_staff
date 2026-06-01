import { useContext } from 'react';
import { ToastContext } from '@/app/providers/ToastProvider.jsx';

/** Fire transient feedback toasts: `toast('Saqlandi', 'success')`. */
export function useToast() {
  return useContext(ToastContext).toast;
}
