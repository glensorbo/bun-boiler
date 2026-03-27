import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { setRememberedEmail, setToken } from '../state/authSlice';
import { clearLoginForm } from '../state/loginFormSlice';
import { useLoginMutation } from '@frontend/redux/api/authApi';

import type { LoginFormValues } from '../logic/loginSchema';
import type { AppDispatch } from '@frontend/redux/store';

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const submit = async (values: LoginFormValues) => {
    const result = await loginMutation({
      email: values.email,
      password: values.password,
    });

    if ('data' in result && result.data) {
      dispatch(setToken(result.data.token));
      dispatch(setRememberedEmail(values.rememberMe ? values.email : null));
      dispatch(clearLoginForm());
      toast.success('Welcome back! 👋');
      void navigate('/');
    } else if ('error' in result) {
      toast.error(result.error.message);
    }
  };

  return { submit, isLoading };
};
