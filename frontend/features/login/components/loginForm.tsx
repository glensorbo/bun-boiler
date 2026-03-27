import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../logic/loginSchema';
import { setLoginFormValues, clearLoginForm } from '../state/loginFormSlice';

import type { LoginFormValues } from '../logic/loginSchema';
import type { AppDispatch, RootState } from '@frontend/redux/store';

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rememberedEmail = useSelector(
    (state: RootState) => state.auth.rememberedEmail,
  );

  const { submit, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
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
        {...register('email')}
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus={!rememberedEmail}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />

      <TextField
        {...register('password')}
        label="Password"
        type="password"
        autoComplete="current-password"
        autoFocus={!!rememberedEmail}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
      />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
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
