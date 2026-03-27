import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import type { RootState } from '@frontend/redux/store';
import type { ReactNode } from 'react';

import 'react-toastify/dist/ReactToastify.css';

interface Props {
  children: ReactNode;
}

/**
 * Renders the react-toastify container and syncs its theme to the Redux theme mode.
 * Must be rendered inside the Redux Provider and ThemeProvider.
 */
export const ToastProvider = ({ children }: Props) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const toastTheme = mode === 'system' ? 'auto' : mode;

  return (
    <>
      {children}
      <ToastContainer position="top-right" theme={toastTheme} />
    </>
  );
};
