import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { setToken } from '@frontend/features/login/state/authSlice';
import { useChangePasswordMutation } from '@frontend/redux/api/authApi';

import type { AppDispatch } from '@frontend/redux/store';

type Errors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const validate = (values: ChangePasswordValues): Errors => {
  const errors: Errors = {};

  if (!values.currentPassword.trim()) {
    errors.currentPassword = 'Current password is required';
  }
  if (values.newPassword.length < 12) {
    errors.newPassword = 'Password must be at least 12 characters';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  }
  if (values.confirmPassword && values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const useChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Errors>({});
  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

  const clearErrors = () => setErrors({});

  const submit = async (values: ChangePasswordValues): Promise<boolean> => {
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    if (values.newPassword !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return false;
    }

    clearErrors();

    const result = await changePasswordMutation({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });

    if ('error' in result) {
      toast.error(
        result.error?.message ?? 'Failed to change password. Please try again.',
      );
      return false;
    }

    dispatch(setToken(result.data.token));
    toast.success('Password changed successfully! 🔒');
    return true;
  };

  return { submit, isLoading, errors, clearErrors };
};
