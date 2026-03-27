import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../logic/loginSchema';
import { useFormFocus } from '@frontend/shared/hooks/useFormFocus';

import type { LoginFormValues } from '../logic/loginSchema';
import type { RootState } from '@frontend/redux/store';

export const LoginForm = () => {
  const rememberedEmail = useSelector(
    (state: RootState) => state.auth.rememberedEmail,
  );

  const { submit, isLoading } = useLogin();

  const { register, handleSubmit, control, formState } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      mode: 'onBlur',
      reValidateMode: 'onChange',
      defaultValues: {
        email: rememberedEmail ?? '',
        password: '',
        rememberMe: !!rememberedEmail,
      },
    });

  const { errors } = formState;
  const { field, showError } = useFormFocus<LoginFormValues>({
    formState,
    register,
  });

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
        error={showError('email')}
        helperText={showError('email') ? errors.email?.message : undefined}
        fullWidth
      />

      <TextField
        {...field('password')}
        label="Password"
        type="password"
        autoComplete="current-password"
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
                  slotProps={{ input: { ref: rememberMeField.ref } }}
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
