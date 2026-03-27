import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { clearToken } from '@frontend/features/login/state/authSlice';

import type { AppDispatch } from '@frontend/redux/store';

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(clearToken());
    toast.info('Logged out 👋');
    void navigate('/login');
  };

  return { logout };
};
