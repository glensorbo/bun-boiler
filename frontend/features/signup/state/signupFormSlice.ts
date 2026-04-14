import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SignupFormFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignupFormErrors = Partial<Record<keyof SignupFormFields, string>>;

interface SignupFormState extends SignupFormFields {
  errors: SignupFormErrors;
}

const initialState: SignupFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
};

/**
 * Ephemeral form state for the self-service signup form.
 * NOT persisted to localStorage.
 */
export const signupFormSlice = createSlice({
  name: 'signupForm',
  initialState,
  reducers: {
    setSignupFormField(
      state,
      action: PayloadAction<Partial<SignupFormFields>>,
    ) {
      Object.assign(state, action.payload);
    },
    setSignupFormErrors(state, action: PayloadAction<SignupFormErrors>) {
      state.errors = action.payload;
    },
    clearSignupForm() {
      return initialState;
    },
  },
});

export const { setSignupFormField, setSignupFormErrors, clearSignupForm } =
  signupFormSlice.actions;
