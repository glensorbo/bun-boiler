import { setSignupFormErrors } from '../state/signupFormSlice';
import { signupSchema } from './signupSchema';
import type {
  SignupFormErrors,
  SignupFormFields,
} from '../state/signupFormSlice';
import type { AppDispatch } from '@frontend/redux/store';

export const validateSignupForm = (
  dispatch: AppDispatch,
  values: SignupFormFields,
): boolean => {
  const result = signupSchema.safeParse(values);

  if (!result.success) {
    const errors: SignupFormErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof SignupFormErrors;
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    dispatch(setSignupFormErrors(errors));
    return false;
  }

  dispatch(setSignupFormErrors({}));
  return true;
};
