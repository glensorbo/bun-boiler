import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../logic/loginSchema';
import { clearLoginForm, setLoginFormValues } from '../state/loginFormSlice';

import type { LoginFormValues } from '../logic/loginSchema';
import type { AppDispatch, RootState } from '@frontend/redux/store';
import type { FocusEvent } from 'react';

type TextField = 'email' | 'password';

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rememberedEmail = useSelector(
    (state: RootState) => state.auth.rememberedEmail,
  );

  const { submit, isLoading } = useLogin();

  // Tracks which field is currently focused so errors are hidden while editing.
  const [focusedField, setFocusedField] = useState<TextField | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, dirtyFields, touchedFields, isSubmitted },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: rememberedEmail ?? '',
      password: '',
      rememberMe: !!rememberedEmail,
    },
  });

  // Sync live form values to Redux as the user types.
  useEffect(() => {
    const subscription = watch((values) => {
      dispatch(
        setLoginFormValues({
          email: values.email ?? '',
          password: values.password ?? '',
        }),
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  // Clear ephemeral form state from Redux on unmount.
  useEffect(() => {
    return () => {
      dispatch(clearLoginForm());
    };
  }, [dispatch]);

  /**
   * Wraps register() to inject focus tracking without losing RHF's onBlur.
   * Errors are hidden while the field is focused (user is actively editing).
   */
  const field = (name: TextField) => {
    const { onBlur, ...rest } = register(name);
    return {
      ...rest,
      onFocus: () => {
        setFocusedField(name);
      },
      onBlur: (e: FocusEvent<HTMLInputElement>) => {
        setFocusedField(null);
        void onBlur(e);
      },
    };
  };

  /**
   * An error is visible only when:
   * - the field is not currently focused, AND
   * - the field has an error, AND
   * - either the form was submitted OR the field was dirtied then blurred
   */
  const showError = (name: TextField) =>
    focusedField !== name &&
    !!errors[name] &&
    (isSubmitted || (!!dirtyFields[name] && !!touchedFields[name]));

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      <Typography variant="h5" component="h1" fontWeight={600}>
        Sign in
      </Typography>

      <TextField
        {...field('email')}
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus={!rememberedEmail}
        error={showError('email')}
        helperText={showError('email') ? errors.email?.message : undefined}
        fullWidth
      />

      <TextField
        {...field('password')}
        label="Password"
        type="password"
        autoComplete="current-password"
        autoFocus={!!rememberedEmail}
        error={showError('password')}
        helperText={
          showError('password') ? errors.password?.message : undefined
        }
        fullWidth
      />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Controller
          name="rememberMe"
          control={control}
          render={({ field: rememberMeField }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMeField.value}
                  onChange={rememberMeField.onChange}
                  onBlur={rememberMeField.onBlur}
                  inputRef={rememberMeField.ref}
                />
              }
              label="Remember me"
            />
          )}
        />
        {errors.rememberMe && (
          <FormHelperText error>{errors.rememberMe.message}</FormHelperText>
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
