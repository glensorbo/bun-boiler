import { useState } from 'react';

import type { FocusEvent } from 'react';
import type {
  FieldPath,
  FieldValues,
  FormState,
  UseFormRegister,
} from 'react-hook-form';

type Options<T extends FieldValues> = {
  formState: Pick<
    FormState<T>,
    'errors' | 'dirtyFields' | 'touchedFields' | 'isSubmitted'
  >;
  register: UseFormRegister<T>;
};

/**
 * Generic hook that adds focus-aware error visibility to RHF forms.
 *
 * An error is visible for a field only when ALL of the following are true:
 *  1. The field is not currently focused (user is not actively editing)
 *  2. RHF has recorded an error for the field
 *  3. Either the form was submitted, OR the field was both dirtied (typed in)
 *     AND touched (blurred) — preventing errors on tab-through of empty fields
 *
 * Usage:
 *   const { field, showError } = useFormFocus({ formState, register });
 *   <TextField {...field('email')} error={showError('email')} />
 */
export const useFormFocus = <T extends FieldValues>({
  formState,
  register,
}: Options<T>) => {
  const { errors, dirtyFields, touchedFields, isSubmitted } = formState;
  const [focusedField, setFocusedField] = useState<FieldPath<T> | null>(null);

  const field = (name: FieldPath<T>) => {
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

  const showError = (name: FieldPath<T>): boolean => {
    const dirty = dirtyFields as Partial<Record<string, boolean>>;
    const touched = touchedFields as Partial<Record<string, boolean>>;
    return (
      focusedField !== name &&
      !!errors[name] &&
      (isSubmitted || (!!dirty[name] && !!touched[name]))
    );
  };

  return { field, showError };
};
