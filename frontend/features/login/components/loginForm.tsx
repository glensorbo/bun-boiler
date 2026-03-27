import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../logic/loginSchema';
import { setLoginFormField } from '../state/loginFormSlice';

import type { LoginFormValues } from '../logic/loginSchema';
import type { AppDispatch, RootState } from '@frontend/redux/store';
import type { FormEvent } from 'react';

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rememberedEmail = useSelector(
    (state: RootState) => state.auth.rememberedEmail,
  );
  const formValues = useSelector((state: RootState) => state.loginForm);
  const { submit, isLoading } = useLogin();

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && rememberedEmail) {
      dispatch(setLoginFormField({ email: rememberedEmail, rememberMe: true }));
      initialized.current = true;
    }
  }, [dispatch, rememberedEmail]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormValues, boolean>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const showError = (name: keyof LoginFormValues) =>
    !!errors[name] && (submitted || !!touched[name]);

  const handleBlur = (name: keyof LoginFormValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const result = loginSchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await submit(result.data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      <Typography variant="h5" component="h1" fontWeight={600}>
        Sign in
      </Typography>

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={formValues.email}
        onChange={(e) => dispatch(setLoginFormField({ email: e.target.value }))}
        onBlur={() => handleBlur('email')}
        error={showError('email')}
        helperText={showError('email') ? errors.email : undefined}
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        value={formValues.password}
        onChange={(e) =>
          dispatch(setLoginFormField({ password: e.target.value }))
        }
        onBlur={() => handleBlur('password')}
        error={showError('password')}
        helperText={showError('password') ? errors.password : undefined}
        fullWidth
      />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.rememberMe}
              onChange={(e) =>
                dispatch(setLoginFormField({ rememberMe: e.target.checked }))
              }
            />
          }
          label="Remember me"
        />
        {showError('rememberMe') && (
          <FormHelperText error>{errors.rememberMe}</FormHelperText>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isLoading}
        fullWidth
      >
        Sign in
      </Button>
    </Box>
  );
};
