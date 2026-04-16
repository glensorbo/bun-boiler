import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useLogoutMutation } from '@frontend/redux/api/authApi';
import { clearToken } from '@frontend/redux/slices/authSlice';
import { useAnalytics } from '@frontend/shared/hooks/useAnalytics';
import type { AppDispatch } from '@frontend/redux/store';

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  const { trackEvent } = useAnalytics();

  const logout = () => {
    trackEvent('logout');
    // Revoke the refresh token on the server and clear the HttpOnly cookie.
    // Fire-and-forget — local session is always cleared immediately.
    void logoutMutation();
    dispatch(clearToken());
    toast.info('Logged out 👋');
    void navigate('/login');
  };

  return { logout };
};
