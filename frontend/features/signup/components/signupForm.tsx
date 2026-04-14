import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router';
import { useSignup } from '../hooks/useSignup';
import { validateSignupForm } from '../logic/validateSignupForm';
import {
  setSignupFormErrors,
  setSignupFormField,
} from '../state/signupFormSlice';
import type { SignupFormFields } from '../state/signupFormSlice';
import type { AppDispatch, RootState } from '@frontend/redux/store';
import type { ChangeEvent } from 'react';

export const SignupForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, email, password, confirmPassword, errors } = useSelector(
    (state: RootState) => state.signupForm,
  );
  const { submit, isLoading } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChangeHandler =
    (field: keyof SignupFormFields) => (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setSignupFormField({ [field]: e.target.value }));
      if (errors[field]) {
        dispatch(setSignupFormErrors({ ...errors, [field]: undefined }));
      }
    };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = { name, email, password, confirmPassword };
    if (!validateSignupForm(dispatch, values)) {
      return;
    }
    await submit(values);
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmitHandler}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
        Create account
      </Typography>

      {/* Honeypot — hidden from real users, bots fill this */}
      <input
        type="text"
        name="website"
        defaultValue=""
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <TextField
        label="Name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={onChangeHandler('name')}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={onChangeHandler('email')}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={password}
        onChange={onChangeHandler('password')}
        error={!!errors.password}
        helperText={errors.password ?? 'At least 12 characters'}
        fullWidth
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        label="Confirm password"
        type={showConfirm ? 'text' : 'password'}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={onChangeHandler('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        fullWidth
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirm((prev) => !prev)}
                  edge="end"
                >
                  {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isLoading}
        fullWidth
      >
        Create account
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};
