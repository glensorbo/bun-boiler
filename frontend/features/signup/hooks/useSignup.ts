import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { clearSignupForm } from '../state/signupFormSlice';
import { useAnalytics } from '@frontend/features/analytics/hooks/useAnalytics';
import { setToken } from '@frontend/features/login/state/authSlice';
import { useSignupMutation } from '@frontend/redux/api/authApi';
import type { SignupFormFields } from '../state/signupFormSlice';
import type { AppDispatch } from '@frontend/redux/store';

export const useSignup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [signupMutation, { isLoading }] = useSignupMutation();
  const { trackEvent } = useAnalytics();

  const submit = async (values: SignupFormFields) => {
    trackEvent('signup_submitted');

    const result = await signupMutation({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      website: '',
    });

    if ('error' in result) {
      const reason =
        result.error?.message ?? 'Signup failed. Please try again.';
      trackEvent('signup_failed', { reason });
      toast.error(reason);
      return;
    }

    trackEvent('signup_success');
    dispatch(setToken(result.data.token));
    dispatch(clearSignupForm());
    toast.success('Account created! Welcome 🎉');
    void navigate('/');
  };

  return { submit, isLoading };
};
